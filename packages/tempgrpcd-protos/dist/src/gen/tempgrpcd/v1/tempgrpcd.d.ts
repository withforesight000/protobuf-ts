import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "../../google/protobuf/timestamp";
/**
 * @generated from protobuf message tempgrpcd.v1.GetAmbientConditionsRequest
 */
export interface GetAmbientConditionsRequest {
    /**
     * @generated from protobuf field: google.protobuf.Timestamp start_time = 1
     */
    startTime?: Timestamp;
    /**
     * @generated from protobuf field: google.protobuf.Timestamp end_time = 2
     */
    endTime?: Timestamp;
    /**
     * @generated from protobuf field: optional uint64 samples = 3
     */
    samples?: string;
}
/**
 * @generated from protobuf message tempgrpcd.v1.GetAmbientConditionsResponse
 */
export interface GetAmbientConditionsResponse {
    /**
     * @generated from protobuf field: map<string, tempgrpcd.v1.AmbientCondition> ambient_conditions = 1
     */
    ambientConditions: {
        [key: string]: AmbientCondition;
    };
}
/**
 * @generated from protobuf message tempgrpcd.v1.AmbientCondition
 */
export interface AmbientCondition {
    /**
     * @generated from protobuf field: float temperature = 1
     */
    temperature: number;
    /**
     * @generated from protobuf field: float humidity = 2
     */
    humidity: number;
    /**
     * @generated from protobuf field: float illumination = 3
     */
    illumination: number;
}
declare class GetAmbientConditionsRequest$Type extends MessageType<GetAmbientConditionsRequest> {
    constructor();
    create(value?: PartialMessage<GetAmbientConditionsRequest>): GetAmbientConditionsRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetAmbientConditionsRequest): GetAmbientConditionsRequest;
    internalBinaryWrite(message: GetAmbientConditionsRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message tempgrpcd.v1.GetAmbientConditionsRequest
 */
export declare const GetAmbientConditionsRequest: GetAmbientConditionsRequest$Type;
declare class GetAmbientConditionsResponse$Type extends MessageType<GetAmbientConditionsResponse> {
    constructor();
    create(value?: PartialMessage<GetAmbientConditionsResponse>): GetAmbientConditionsResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetAmbientConditionsResponse): GetAmbientConditionsResponse;
    private binaryReadMap1;
    internalBinaryWrite(message: GetAmbientConditionsResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message tempgrpcd.v1.GetAmbientConditionsResponse
 */
export declare const GetAmbientConditionsResponse: GetAmbientConditionsResponse$Type;
declare class AmbientCondition$Type extends MessageType<AmbientCondition> {
    constructor();
    create(value?: PartialMessage<AmbientCondition>): AmbientCondition;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AmbientCondition): AmbientCondition;
    internalBinaryWrite(message: AmbientCondition, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message tempgrpcd.v1.AmbientCondition
 */
export declare const AmbientCondition: AmbientCondition$Type;
/**
 * @generated ServiceType for protobuf service tempgrpcd.v1.TempgrpcdService
 */
export declare const TempgrpcdService: ServiceType;
export {};
