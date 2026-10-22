import mongoose from "mongoose"

const auditLogSchema=new mongoose.Schema({
    task_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"task",
        required:true
    },
    changed_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    from_status:{
        type:String,
        enum:["pending","in-progress","under-review","completed"],
        required:true
    },
    to_status:{
        type:String,
        enum: ["pending", "in-progress", "under-review", "completed"],
        required:true
    },
    changed_at:{
        type:Date,
        default:Date.now
    }
},{timestamps:true})

const AuditLog = mongoose.model("auditlog",auditLogSchema)

export default AuditLog

