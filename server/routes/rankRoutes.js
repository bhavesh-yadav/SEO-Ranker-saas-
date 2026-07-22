import express from "express";
import auth from "../middleware/auth.js";
import { addkeyword, deletekeyword, getkeyword, getkeywords, refreshkeyword, toggletracking } from "../controllers/rankController.js";

 const rankRouter = express.Router();

 rankRouter.post('/add',auth, addkeyword,);
 rankRouter.get('/list',auth, getkeywords,);
 rankRouter.get('/:id',auth, getkeyword,);
 rankRouter.post('/:id/refresh',auth, refreshkeyword,);
 rankRouter.put('/:id/toggle',auth, toggletracking,);
 rankRouter.delete('/:id/toggle',auth, deletekeyword,);


 export default rankRouter;