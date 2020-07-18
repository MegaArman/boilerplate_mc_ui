const system = client.registerSystem(0,0)
let command = "minecraft:execute_command"
let clientplayer
let sendUiData
let time = 0
let activate = 0
let activate2=0
let shiftdata

system.initialize = function() {
	const scriptLoggerConfig =
		system.createEventData("minecraft:script_logger_config");
	scriptLoggerConfig.data.log_errors = true;
	scriptLoggerConfig.data.log_information = true;
	scriptLoggerConfig.data.log_warnings = true;
	system
		.broadcastEvent("minecraft:script_logger_config", scriptLoggerConfig);

	// this.registerEventData("AdminPanel:command", {})
	// this.registerEventData("AdminPanel:nbt", {})
	// this.registerEventData("AdminPanel:openadminsmenu", {})
	// this.registerEventData("AdminPanel:addplayer", {})
	// this.registerEventData("AdminPanel:givepermission", {})
	// this.registerEventData("AdminPanel:day", {})
	// this.registerEventData("AdminPanel:night", {})
	// this.registerEventData("AdminPanel:midnight", {})
	// this.registerEventData("AdminPanel:clear", {})
	// this.registerEventData("AdminPanel:rain", {})
	// this.registerEventData("AdminPanel:thunder", {})
	// this.registerEventData("AdminPanel:noon", {})
	// this.registerEventData("AdminPanel:sunset", {})
	// this.registerEventData("AdminPanel:sunrise", {})
	this.listenForEvent("AdminPanel:loadmenu", (event) => this.onmenu(event))
	this.listenForEvent("AdminPanel:loadui", (event) => this.onload(event))
	this.listenForEvent("minecraft:ui_event", (eventdata) => this.onUIMessage(eventdata))
	this.listenForEvent("minecraft:client_entered_world", (eventData) => this.entered(eventData))
}

system.update = function() {
	// const chatEventData = system
	// 		.createEventData("minecraft:display_chat_event");
	// chatEventData.data.message = "hello";
	// system
	// 	.broadcastEvent("minecraft:display_chat_event", chatEventData);
	if(activate == 1) {
	   let eventdata = this.createEventData("minecraft:send_ui_event")
	   eventdata.data.eventIdentifier = "showplayers"
	   eventdata.data.data = JSON.stringify(sendUiData)
	   this.broadcastEvent("minecraft:send_ui_event", eventdata)
	   time++
	}
	if(activate2==1) {
		let event = this.createEventData("minecraft:send_ui_event")
        event.data.eventIdentifier = "shiftui"
	   event.data.data = JSON.stringify(shiftdata)
	   this.broadcastEvent("minecraft:send_ui_event", event)
	   time++
	}
	if(time == 10) {
		activate = 0
		time = 0
		activate2=0
	}
}

system.entered = function (eventData) {
	let loadEventData = this.createEventData("minecraft:load_ui");
	loadEventData.data.path = "main.html";
	// loadEventData.data.options.is_showing_menu = false;
	// loadEventData.data.options.absorbs_input = true;
	// loadEventData.data.options.always_accepts_input  = true;
	// loadEventData.data.options.render_game_behind = false;
	// loadEventData.data.options.should_steal_mouse = true;
	// loadEventData.data.options.force_render_below = true;
	system.broadcastEvent("minecraft:load_ui", loadEventData);

	// clientplayer = eventData.data.player
	// let event = this.createEventData("AdminPanel:addplayer")
	// event.data = clientplayer
	// this.broadcastEvent("AdminPanel:addplayer", event)
}

system.onload = function (event) {
	let serverplayer = event.data.data.player
	// if (clientplayer.__unique_id__["64bit_low"] === serverplayer.__unique_id__["64bit_low"] && clientplayer.__unique_id__["64bit_high"] === serverplayer.__unique_id__["64bit_high"]) {
		let ui = this.createEventData("minecraft:load_ui")
		ui.data.path = "main.html"
		this.broadcastEvent("minecraft:load_ui", ui)
	// }
}

system.onUIMessage = function (eventdata) {
	let eventData = eventdata.data
  if(eventData === "closepressed") {
    	this.close()
	}
}

system.close = function () {
	let event = this.createEventData("minecraft:unload_ui")
    event.data.path = "main.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "time.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "weather.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "command.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "adminsmenu.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "shift.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "nbtshift.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "nbt.html"
	this.broadcastEvent("minecraft:unload_ui", event)
	event.data.path = "nbthelp.html"
	this.broadcastEvent("minecraft:unload_ui", event)

}

system.day = function() {
	let event = this.createEventData("AdminPanel:day")
	this.broadcastEvent("AdminPanel:day", event)
}

system.night = function() {
	let event = this.createEventData("AdminPanel:night")
	this.broadcastEvent("AdminPanel:night", event)
}

system.midnight = function() {
	let event = this.createEventData("AdminPanel:midnight")
	this.broadcastEvent("AdminPanel:midnight", event)
}

system.clear = function() {
	let event = this.createEventData("AdminPanel:clear")
	this.broadcastEvent("AdminPanel:clear", event)
}

system.rain = function() {
	let event = this.createEventData("AdminPanel:rain")
	this.broadcastEvent("AdminPanel:rain", event)
}

system.thunder = function() {
	let event = this.createEventData("AdminPanel:thunder")
	this.broadcastEvent("AdminPanel:thunder", event)
}

system.noon = function() {
	let event = this.createEventData("AdminPanel:noon")
	this.broadcastEvent("AdminPanel:noon", event)
}

system.sunset = function() {
	let event = this.createEventData("AdminPanel:sunset")
	this.broadcastEvent("AdminPanel:sunset", event)
}

system.sunrise = function() {
	let event = this.createEventData("AdminPanel:sunrise")
	this.broadcastEvent("AdminPanel:sunrise", event)
}

system.back = function () {
	this.close()
	let event = this.createEventData("minecraft:load_ui")
    event.data.path = "main.html"
	this.broadcastEvent("minecraft:load_ui", event)
}
