import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name= self.scope['url_route']['kwargs']['thread_id']
        self.room_group_name= f'chat_{self.room_name}'

        #Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def receive(self, text_data):
        text_data_json= json.loads(text_data)
        message= text_data_json['content']
        sender= text_data_json['sender'] 

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'chat_message',
                'content':message,
                'sender':sender
            }
        )
    async def chat_message(self,event):
        sender= event['sender']
        content= event['content']

        await self.send(text_data=json.dumps({
            'content':content,
            'sender':sender
        }))