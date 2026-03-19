//This class will contain all the common methods related to API  response and API Response validation
import { type APIRequestContext, request, expect } from "@playwright/test";
import config from '../../config/config.json' with {type: 'json'};

export class ApiCommons {

    private requestContext !: APIRequestContext; //variable to store request context like  base url, token, headers etc..
    private response: any; //variable to store response coming out from the request

    //Create api request context
    async init() {
        this.requestContext = await request.newContext({
            baseURL:  config.api.baseurl,
            extraHTTPHeaders: {
                'Accept': 'application/vnd.github+json',
                'Authorization': config.api.token,
            }
        })
    }

    //method to send request
    async getResponse(requestType: string, endPoint: string, requestBody?: any) {
        switch (requestType.toLowerCase()) {
            case 'get':
                this.response = await this.requestContext.get(endPoint);
                break;
            case 'post':
                this.response = await this.requestContext.post(endPoint, { data: requestBody });
                break;
            case 'put':
                this.response = await this.requestContext.put(endPoint, { data: requestBody });
                break;
            case 'patch':
                this.response = await this.requestContext.patch(endPoint, { data: requestBody });
            case 'delete':
                this.response = await this.requestContext.delete(endPoint);
                break;
            default:
                throw new Error('Invalid request type: ' + requestType);
        }
        console.log(await this.response.text());
    }
    // Method to validate status code
    async validateStatusCode(expectedStatusCode: number) {
        const actualStatusCode = this.response.status();
        console.log("Actual Status Code:" + actualStatusCode);
        expect(actualStatusCode).toBe(expectedStatusCode);
    }

    //Method to validate response body
    async validatestatusMessage(expectedStatusMessage: string) {
        const actualStatusMessage = await this.response.statusText();
        console.log("Actual Status Body:" + actualStatusMessage);
        expect(actualStatusMessage).toBe(expectedStatusMessage);
    }


    //Method  to validate  response body
    async validateResponseBody(key: string, expectedValue: any) {
        const responseBody = await this.response.json();
        const actualValue = responseBody[key];
        console.log("Actual value :" + actualValue);
        expect(actualValue).toBe(expectedValue);
    }

    // Method to validate reponse header
    async validateResponseHeader(key: string, expectedType: any) {
        const resonseBodyHeaders = await this.response.headers();
        const actualValue = resonseBodyHeaders[key];
        console.log("Actual Header Value:" + actualValue);
        expect(actualValue).toBe(expectedType);
    }

    // Method to validate the response body schema
    async validateResponseBodySchema(key: string, expecredType: any) {
        const responseBody = await this.response.json();
        const actualValue = responseBody[key];
        const dataType = typeof actualValue;
        console.log("Actual value :" + actualValue);
        expect(dataType).toBe(expecredType);

    }

    // Method to validate the reponse cookies
    async validateResponseCookies(key: string, expectedVlaue: any) {
        const responseCookies = await this.response.cookies();
        const actualValue = responseCookies[key];
        expect(actualValue).toBe(expectedVlaue);
    }
}