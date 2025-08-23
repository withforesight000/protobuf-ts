import { TempgrpcdService } from "./tempgrpcd";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service tempgrpcd.v1.TempgrpcdService
 */
export class TempgrpcdServiceClient {
    constructor(_transport) {
        this._transport = _transport;
        this.typeName = TempgrpcdService.typeName;
        this.methods = TempgrpcdService.methods;
        this.options = TempgrpcdService.options;
    }
    /**
     * @generated from protobuf rpc: GetAmbientConditions
     */
    getAmbientConditions(input, options) {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept("unary", this._transport, method, opt, input);
    }
}
