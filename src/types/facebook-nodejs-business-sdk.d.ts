declare module 'facebook-nodejs-business-sdk' {
    export class Content {
        constructor();
        setId(id: string): this;
        setQuantity(quantity: number): this;
        setTitle(title: string): this;
        setCategory(category: string): this;
    }

    export class CustomData {
        constructor();
        setValue(value: number): this;
        setCurrency(currency: string): this;
        setContentName(name: string): this;
        setContentIds(ids: string[]): this;
        setContentType(type: string): this;
    }

    export class UserData {
        constructor();
        setEmail(email: string): this;
        setPhone(phone: string): this;
        setClientIpAddress(ip: string): this;
        setClientUserAgent(agent: string): this;
        setFbp(fbp: string): this;
        setFbc(fbc: string): this;
    }

    export class ServerEvent {
        constructor();
        setEventName(name: string): this;
        setEventTime(time: number): this;
        setUserData(userData: UserData): this;
        setCustomData(customData: CustomData): this;
        setEventSourceUrl(url: string): this;
        setActionSource(source: string): this;
        setEventId(id: string): this;
    }

    export class EventRequest {
        constructor(accessToken: string, pixelId: string);
        setEvents(events: ServerEvent[]): this;
        execute(): Promise<any>;
    }
}
