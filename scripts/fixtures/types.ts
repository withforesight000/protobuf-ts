import { GetAmbientConditionsRequest, GetAmbientConditionsResponse, Timestamp } from '@withforesight/tempgrpcd-protos';
const timestamp: Timestamp = { seconds: '1', nanos: 2 };
const request: GetAmbientConditionsRequest = { startTime: timestamp, samples: '18446744073709551615' };
const response: GetAmbientConditionsResponse = { ambientConditions: { sensor: { temperature: 22.5, humidity: 50, illumination: 100 } } };
GetAmbientConditionsRequest.toBinary(request);
GetAmbientConditionsResponse.fromBinary(GetAmbientConditionsResponse.toBinary(response));
