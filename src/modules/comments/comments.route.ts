import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", auth(UserRole.USER , UserRole.ADMIN), commentController.createComment);



router.get("/post/:postId", commentController.allCommentOfPost);
router.get("/:commentId", commentController.getCommentById);
router.patch("/:commentId", commentController.updateComment);
router.delete("/:commentId", commentController.deleteComment);

export const commentRoutes = router;
