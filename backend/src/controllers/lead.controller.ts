import { Response } from 'express';
import { Lead } from '../models/Lead';
import { AuthRequest, LeadQueryParams, LeadStatus, LeadSource, UserRole } from '../types';
import { sendSuccess, sendError, buildPaginationMeta } from '../utils/response';
import { FilterQuery } from 'mongoose';
import { ILead } from '../types';

const DEFAULT_LIMIT = 10;

const buildLeadFilter = (
  query: LeadQueryParams,
  userId: string,
  role: UserRole
): FilterQuery<ILead> => {
  const filter: FilterQuery<ILead> = {};

  // Sales users can only see their own leads
  if (role === UserRole.SALES) {
    filter.createdBy = userId;
  }

  if (query.status && Object.values(LeadStatus).includes(query.status)) {
    filter.status = query.status;
  }

  if (query.source && Object.values(LeadSource).includes(query.source)) {
    filter.source = query.source;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  return filter;
};

export const getLeads = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query as LeadQueryParams;
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || String(DEFAULT_LIMIT), 10)));
    const skip = (page - 1) * limit;
    const sortOrder = query.sort === 'oldest' ? 1 : -1;

    const filter = buildLeadFilter(query, req.user!.id, req.user!.role);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, page, limit);
    sendSuccess(res, leads, 'Leads fetched successfully.', 200, meta);
  } catch (error) {
    console.error('Get leads error:', error);
    sendError(res, 'Failed to fetch leads.', 500);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    // Sales users can only view their own leads
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy._id.toString() !== req.user!.id
    ) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    sendSuccess(res, lead);
  } catch (error) {
    sendError(res, 'Failed to fetch lead.', 500);
  }
};

export const createLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, status, source, notes, assignedTo } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status: status || LeadStatus.NEW,
      source,
      notes,
      assignedTo: assignedTo || undefined,
      createdBy: req.user!.id,
    });

    const populated = await lead.populate('createdBy', 'name email');
    sendSuccess(res, populated, 'Lead created successfully.', 201);
  } catch (error) {
    console.error('Create lead error:', error);
    sendError(res, 'Failed to create lead.', 500);
  }
};

export const updateLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const { name, email, status, source, notes, assignedTo } = req.body;
    const updates: Partial<ILead> = {};

    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (status !== undefined) updates.status = status;
    if (source !== undefined) updates.source = source;
    if (notes !== undefined) updates.notes = notes;
    if (assignedTo !== undefined) updates.assignedTo = assignedTo;

    const updated = await Lead.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    sendSuccess(res, updated, 'Lead updated successfully.');
  } catch (error) {
    sendError(res, 'Failed to update lead.', 500);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    // Only admin can delete any lead; sales users can only delete their own
    if (
      req.user!.role === UserRole.SALES &&
      lead.createdBy.toString() !== req.user!.id
    ) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    await Lead.findByIdAndDelete(req.params.id);
    sendSuccess(res, null, 'Lead deleted successfully.');
  } catch (error) {
    sendError(res, 'Failed to delete lead.', 500);
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query as LeadQueryParams;
    const filter = buildLeadFilter(query, req.user!.id, req.user!.role);

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const escapeCSV = (val: unknown): string => {
      const str = val === undefined || val === null ? '' : String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    };

    const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
    const rows = leads.map((lead) => [
      escapeCSV(lead._id),
      escapeCSV(lead.name),
      escapeCSV(lead.email),
      escapeCSV(lead.status),
      escapeCSV(lead.source),
      escapeCSV(lead.notes),
      escapeCSV(lead.createdAt),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('leads-export.csv');
    res.send(csv);
  } catch (error) {
    sendError(res, 'Failed to export leads.', 500);
  }
};

export const getLeadStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const matchStage =
      req.user!.role === UserRole.SALES
        ? { $match: { createdBy: req.user!.id } }
        : { $match: {} };

    const [statusStats, sourceStats, total] = await Promise.all([
      Lead.aggregate([
        matchStage,
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        matchStage,
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(
        req.user!.role === UserRole.SALES ? { createdBy: req.user!.id } : {}
      ),
    ]);

    sendSuccess(res, { total, statusStats, sourceStats });
  } catch (error) {
    sendError(res, 'Failed to fetch stats.', 500);
  }
};
