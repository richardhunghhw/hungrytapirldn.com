export type JSONObject = { [key: string]: JSONValue };

export type JSONValue = JSONObject | Array<JSONValue> | string | number | boolean;
