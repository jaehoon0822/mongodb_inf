const { model, Schema, Types: { ObjectId } } = require("mongoose");

const CommentSchema = new Schema({
	content: { type: String, required: true },
	userFullname: { type: String, required: true },
	user: { type: ObjectId, required: true, ref: 'user' },
	blog: { type: ObjectId, required: true, ref: 'blog'}
}, { timestamps: true});

CommentSchema.index({ blog: 1, createdAt: -1 });

const Comment = model('comment', CommentSchema);

module.exports = { Comment, CommentSchema };

