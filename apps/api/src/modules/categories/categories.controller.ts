import type { Request, Response } from 'express';
import { sendNoContent, sendPaginated, sendSuccess } from '../../shared/http/http';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import * as categoriesService from './categories.service';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoriesService.listCategories(
    req.user!.id,
    req.query.type === 'income' || req.query.type === 'expense' ? req.query.type : undefined,
  );
  sendPaginated(res, { items: categories, total: categories.length });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.getCategory(req.user!.id, req.params.id!);
  sendSuccess(res, { category });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.createCategory(req.user!.id, req.body);
  sendSuccess(res, { category }, 201);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.updateCategory(req.user!.id, req.params.id!, req.body);
  sendSuccess(res, { category });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await categoriesService.deleteCategory(req.user!.id, req.params.id!);
  sendNoContent(res);
});
