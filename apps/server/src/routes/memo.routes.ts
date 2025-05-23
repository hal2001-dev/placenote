import { Router } from 'express';
import { MemoController } from '../controllers/memo.controller';
import { authMiddleware } from '../middleware/auth';
import { body, query } from 'express-validator';

const router = Router();
const memoController = new MemoController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Memo:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - location
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 메모 ID
 *         user_id:
 *           type: string
 *           format: uuid
 *           description: 작성자 ID
 *         title:
 *           type: string
 *           description: 메모 제목
 *         content:
 *           type: string
 *           description: 메모 내용
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               minItems: 2
 *               maxItems: 2
 *               description: [경도, 위도]
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /memos:
 *   post:
 *     summary: 새로운 메모 생성
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               location:
 *                 type: object
 *                 required:
 *                   - longitude
 *                   - latitude
 *                 properties:
 *                   longitude:
 *                     type: number
 *                     minimum: -180
 *                     maximum: 180
 *                   latitude:
 *                     type: number
 *                     minimum: -90
 *                     maximum: 90
 *     responses:
 *       201:
 *         description: 메모 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memo'
 *       401:
 *         description: 인증 필요
 */
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().withMessage('제목을 입력하세요'),
    body('content').notEmpty().withMessage('내용을 입력하세요'),
    body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('유효한 경도를 입력하세요'),
    body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('유효한 위도를 입력하세요'),
  ],
  memoController.createMemo
);

/**
 * @swagger
 * /memos/nearby:
 *   get:
 *     summary: 주변 메모 조회
 *     tags: [Memos]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -180
 *           maximum: 180
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *           minimum: -90
 *           maximum: 90
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           minimum: 0
 *           default: 50
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *     responses:
 *       200:
 *         description: 주변 메모 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Memo'
 *                   - type: object
 *                     properties:
 *                       distance:
 *                         type: number
 *                         description: 현재 위치로부터의 거리(미터)
 *       400:
 *         description: 잘못된 요청
 */
router.get(
  '/nearby',
  [
    query('longitude').isFloat({ min: -180, max: 180 }).withMessage('유효한 경도를 입력하세요'),
    query('latitude').isFloat({ min: -90, max: 90 }).withMessage('유효한 위도를 입력하세요'),
    query('radius').optional().isFloat({ min: 0 }).withMessage('유효한 반경을 입력하세요'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('유효한 개수를 입력하세요'),
  ],
  memoController.getNearbyMemos
);

/**
 * @swagger
 * /memos/{id}:
 *   get:
 *     summary: 특정 메모 조회
 *     tags: [Memos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: 메모 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memo'
 *       404:
 *         description: 메모를 찾을 수 없음
 */
router.get('/:id', memoController.getMemo);

/**
 * @swagger
 * /memos/{id}:
 *   put:
 *     summary: 메모 수정
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   longitude:
 *                     type: number
 *                     minimum: -180
 *                     maximum: 180
 *                   latitude:
 *                     type: number
 *                     minimum: -90
 *                     maximum: 90
 *     responses:
 *       200:
 *         description: 메모 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Memo'
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 메모를 찾을 수 없음
 */
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().notEmpty().withMessage('제목을 입력하세요'),
    body('content').optional().notEmpty().withMessage('내용을 입력하세요'),
    body('location.longitude').optional().isFloat({ min: -180, max: 180 }).withMessage('유효한 경도를 입력하세요'),
    body('location.latitude').optional().isFloat({ min: -90, max: 90 }).withMessage('유효한 위도를 입력하세요'),
  ],
  memoController.updateMemo
);

/**
 * @swagger
 * /memos/{id}:
 *   delete:
 *     summary: 메모 삭제
 *     tags: [Memos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: 메모 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 메모를 찾을 수 없음
 */
router.delete('/:id', authMiddleware, memoController.deleteMemo);

export default router; 