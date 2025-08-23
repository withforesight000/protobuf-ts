import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import type { GetAmbientConditionsResponse } from "./tempgrpcd";
import type { GetAmbientConditionsRequest } from "./tempgrpcd";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service tempgrpcd.v1.TempgrpcdService
 */
export interface ITempgrpcdServiceClient {
    /**
     * @generated from protobuf rpc: GetAmbientConditions
     */
    getAmbientConditions(input: GetAmbientConditionsRequest, options?: RpcOptions): UnaryCall<GetAmbientConditionsRequest, GetAmbientConditionsResponse>;
}
/**
 * @generated from protobuf service tempgrpcd.v1.TempgrpcdService
 */
export declare class TempgrpcdServiceClient implements ITempgrpcdServiceClient, ServiceInfo {
    private readonly _transport;
    typeName: string;
    methods: import("@protobuf-ts/runtime-rpc").MethodInfo<any, any>[];
    options: {
        [extensionName: string]: import("@protobuf-ts/runtime").JsonValue;
    };
    constructor(_transport: RpcTransport);
    /**
     * @generated from protobuf rpc: GetAmbientConditions
     */
    getAmbientConditions(input: GetAmbientConditionsRequest, options?: RpcOptions): UnaryCall<GetAmbientConditionsRequest, GetAmbientConditionsResponse>;
}
