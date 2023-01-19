type EventType =
  | 'CHAT'
  | 'NAME_CHANGE'
  | 'USER_JOINED'
  | 'STREAM_STARTED'
  | 'STREAM_STOPPED';

type StreamStartedData = {
  id: string;
  name: string;
  streamTitle: string;
  summary: string;
  timestamp: string;
};

export type OwncastWebhook = {
  type: EventType;
  eventData: StreamStartedData;
};