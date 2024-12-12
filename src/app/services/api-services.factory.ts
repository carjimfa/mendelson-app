import { environment } from "../../environments/environment";
import { ApiMockService } from "../mocks/api-mock.service";
import { ApiService } from "./api.service";

export function ApiServicesFactory(): ApiService {
  if (environment.useMocks) {
    return new ApiMockService();
  } else {
    return new ApiService();
  }
}