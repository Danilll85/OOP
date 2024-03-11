import { Schema, model } from "mongoose";

const Role = new Schema({
    value: { type: String, unique: true, default: "USER" },
});

//module.exports = model("Role", Role);

export default model("Role", Role);

/*
import { Schema, model } from "mongoose";

export class Role {
    value;
    constructor(roleType) {
        this.value = roleType === "seller" ? "SELLER" : "USER";
    }
}

const roleSchema = new Schema({
    value: { type: String, unique: true },
});

roleSchema.pre("save", function (next) {
    if (!this.value) {
        this.value = new Role().value;
    }
    next();
});

export default model("Role", roleSchema);

*/
