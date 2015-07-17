/*
 Created by Harbinger Systems Pvt. Ltd on 16/07/15.
 
 Timeline and Twilio example gives you an idea of,
 how the Timeline push pins to timeline using pebble
 timeline API.
 
 Below are the pins which will get push to timeline.
 1) [Sports Pin] - Football Match
 2) [Weather Pin] - Nice Day
 3) [Movie Pin] - Movie with Alice
 4) [Meeting]
 
 Also this example shows you how to make twilio call
 using pebble app.
 
 You can test twilio call using [Movie Pin] - Movie with Alice
 >> Press select button and choose any answer and to test twilio call.
 
*/

#include <pebble.h>

#define READY_KEY 1 
#define PUSH_PINS_KEY 2
#define MOVIE_REPLY_KEY 3
  
static Window *s_main_window;
static TextLayer *s_text_layer;

static BitmapLayer *s_layer_home_logo;
static GBitmap *s_icon_logo;

void send_app_msg(int key,int value)
{
    // send app msg to Js 
    DictionaryIterator *iter;
    app_message_outbox_begin(&iter);
    dict_write_uint32(iter,key,value);
    app_message_outbox_send();
}

char *translate_error(AppMessageResult result) {
    switch (result) {
        case APP_MSG_OK: return "APP_MSG_OK";
        case APP_MSG_SEND_TIMEOUT: return "APP_MSG_SEND_TIMEOUT";
        case APP_MSG_SEND_REJECTED: return "APP_MSG_SEND_REJECTED";
        case APP_MSG_NOT_CONNECTED: return "APP_MSG_NOT_CONNECTED";
        case APP_MSG_APP_NOT_RUNNING: return "APP_MSG_APP_NOT_RUNNING";
        case APP_MSG_INVALID_ARGS: return "APP_MSG_INVALID_ARGS";
        case APP_MSG_BUSY: return "APP_MSG_BUSY";
        case APP_MSG_BUFFER_OVERFLOW: return "APP_MSG_BUFFER_OVERFLOW";
        case APP_MSG_ALREADY_RELEASED: return "APP_MSG_ALREADY_RELEASED";
        case APP_MSG_CALLBACK_ALREADY_REGISTERED: return "APP_MSG_CALLBACK_ALREADY_REGISTERED";
        case APP_MSG_CALLBACK_NOT_REGISTERED: return "APP_MSG_CALLBACK_NOT_REGISTERED";
        case APP_MSG_OUT_OF_MEMORY: return "APP_MSG_OUT_OF_MEMORY";
        case APP_MSG_CLOSED: return "APP_MSG_CLOSED";
        case APP_MSG_INTERNAL_ERROR: return "APP_MSG_INTERNAL_ERROR";
        default: return "UNKNOWN ERROR";
    }
}

/* ----------------------------------- App Message callbacks --------------------------- */
static void inbox_received_callback(DictionaryIterator *iterator, void *context)
{
    Tuple *t = dict_read_first(iterator);
    while (t != NULL)
    {
        switch (t->key)
        {
            case READY_KEY:
            {
                  printf("C: Received Ready Message");
                   if(launch_reason() == APP_LAUNCH_TIMELINE_ACTION)
                  {
                      uint32_t value = launch_get_args();
                      int val= (int)value;
                      if(value == 1)
                      {
                        printf("In 1st option value=> %d",val);
                        send_app_msg(MOVIE_REPLY_KEY,val);
                      }
                      else if(value == 2)
                      {
                        printf("In 2nd option value=> %d",val);
                        send_app_msg(MOVIE_REPLY_KEY,val);
                      }
                     else if(value == 3)
                      {
                        printf("In 3rd option value=> %d",val);
                        send_app_msg(MOVIE_REPLY_KEY,val);
                     }
                   }
            }
                break;
                
        }
        // Get next pair, if any
        t = dict_read_next(iterator);
    }
}
static void inbox_dropped_callback(AppMessageResult reason, void *context)
{
    APP_LOG(APP_LOG_LEVEL_ERROR, "C: Outbox send failed! %s", translate_error(reason));
}
static void outbox_failed_callback(DictionaryIterator *iterator, AppMessageResult reason, void *context)
{
    APP_LOG(APP_LOG_LEVEL_ERROR, "C: Outbox send failed! %s", translate_error(reason));
}
static void outbox_sent_callback(DictionaryIterator *iterator, void *context)
{
    APP_LOG(APP_LOG_LEVEL_INFO, "C: Outbox send success!");
}

/* ----------------------------------- Action Button Handler ----------------------------------- */
void select_btn_click_handler(ClickRecognizerRef recognizer , void *context)
{
    // send app msg to Js asking for pins to be pushed
    send_app_msg(PUSH_PINS_KEY,2);
}

void click_config_provider(void *context)
{
   window_single_click_subscribe(BUTTON_ID_SELECT, (ClickHandler) select_btn_click_handler);
}


static void window_load(Window *window) {
  //We will add the creation of the Window's elements here!
  Layer *window_layer = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(window_layer);
  
   //-- add bitmap layer-->>
  s_icon_logo = gbitmap_create_with_resource(RESOURCE_ID_ICON_HARBINGER_LOGO);
  GRect bitmap_bounds = gbitmap_get_bounds(s_icon_logo);
    
  s_layer_home_logo = bitmap_layer_create(GRect((bounds.size.w / 2) - (bitmap_bounds.size.w / 2), 5, bitmap_bounds.size.w, bitmap_bounds.size.h));
  bitmap_layer_set_bitmap(s_layer_home_logo, s_icon_logo);
  bitmap_layer_set_compositing_mode(s_layer_home_logo, GCompOpSet);
  layer_add_child(window_layer, bitmap_layer_get_layer(s_layer_home_logo));
   
  //-- add text later -->>
  s_text_layer = text_layer_create(GRect(0, (bitmap_bounds.origin.y + bitmap_bounds.size.h) + 5, bounds.size.w, bounds.size.h - ((bitmap_bounds.origin.y + bitmap_bounds.size.h))));
  text_layer_set_text_alignment(s_text_layer, GTextAlignmentCenter);
  text_layer_set_overflow_mode(s_text_layer, GTextOverflowModeWordWrap);
  text_layer_set_font(s_text_layer, fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD));
  text_layer_set_text_color(s_text_layer, GColorCobaltBlue);
  text_layer_set_text(s_text_layer, "Press select button and check your timeline after a few seconds to see the Pins!");
  layer_add_child(window_layer, text_layer_get_layer(s_text_layer));
}

static void window_unload(Window *window) {
  //We will safely destroy the Window's elements here!
  text_layer_destroy(s_text_layer);
}

static void init() {
  //Initialize the app elements here!
  s_main_window = window_create();
  window_set_background_color(s_main_window, GColorClear);
  window_set_window_handlers(s_main_window, (WindowHandlers) {
    .load = window_load,
    .unload = window_unload,
  });
  
  window_set_click_config_provider(s_main_window, click_config_provider);
  window_stack_push(s_main_window, true);
  
  //Register appmsg callbacks
    app_message_register_outbox_failed(outbox_failed_callback);
    app_message_register_outbox_sent(outbox_sent_callback);
    app_message_register_inbox_received(inbox_received_callback);
    app_message_register_inbox_dropped(inbox_dropped_callback);
    app_message_open(app_message_inbox_size_maximum(), app_message_outbox_size_maximum());
  
}

static void deinit() {
  //De-initialize elements here to save memory!
  window_destroy(s_main_window);
  bitmap_layer_destroy(s_layer_home_logo);
  text_layer_destroy(s_text_layer);
}

int main() {
  init();
  app_event_loop();
  deinit();
}

