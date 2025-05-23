import { Response } from 'express';
import { MemoService } from '../services/memo.service';
import { MemoCreateInput, MemoUpdateInput, NearbyMemoQuery } from '../models/memo';
import { AuthRequest } from '../middleware/auth';

export class MemoController {
  private memoService: MemoService;

  constructor() {
    this.memoService = new MemoService();
  }

  createMemo = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const input: MemoCreateInput = req.body;
      const memo = await this.memoService.createMemo(req.userId, input);
      res.status(201).json(memo);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create memo' });
    }
  };

  getMemo = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const memo = await this.memoService.getMemoById(id);
      res.json(memo);
    } catch (error) {
      res.status(404).json({ message: error instanceof Error ? error.message : 'Memo not found' });
    }
  };

  updateMemo = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.params;
      const input: MemoUpdateInput = req.body;
      const memo = await this.memoService.updateMemo(id, req.userId, input);
      res.json(memo);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update memo' });
    }
  };

  deleteMemo = async (req: AuthRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { id } = req.params;
      await this.memoService.deleteMemo(id, req.userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to delete memo' });
    }
  };

  getNearbyMemos = async (req: AuthRequest, res: Response) => {
    try {
      const query: NearbyMemoQuery = {
        longitude: Number(req.query.longitude),
        latitude: Number(req.query.latitude),
        radius: req.query.radius ? Number(req.query.radius) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
      };

      if (isNaN(query.longitude) || isNaN(query.latitude)) {
        return res.status(400).json({ message: 'Invalid coordinates' });
      }

      const memos = await this.memoService.getNearbyMemos(query);
      res.json(memos);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to get nearby memos' });
    }
  };
} 