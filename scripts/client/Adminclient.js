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

	this.registerEventData("AdminPanel:command", {})
	this.registerEventData("AdminPanel:nbt", {})
	this.registerEventData("AdminPanel:openadminsmenu", {})
	this.registerEventData("AdminPanel:addplayer", {})
	this.registerEventData("AdminPanel:givepermission", {})
	this.registerEventData("AdminPanel:day", {})
	this.registerEventData("AdminPanel:night", {})
	this.registerEventData("AdminPanel:midnight", {})
	this.registerEventData("AdminPanel:clear", {})
	this.registerEventData("AdminPanel:rain", {})
	this.registerEventData("AdminPanel:thunder", {})
	this.registerEventData("AdminPanel:noon", {})
	this.registerEventData("AdminPanel:sunset", {})
	this.registerEventData("AdminPanel:sunrise", {})
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

	clientplayer = eventData.data.player
	let event = this.createEventData("AdminPanel:addplayer")
	event.data = clientplayer
	this.broadcastEvent("AdminPanel:addplayer", event)
}

system.onload = function (event) {
	let serverplayer = event.data.data.player
	if (clientplayer.__unique_id__["64bit_low"] === serverplayer.__unique_id__["64bit_low"] && clientplayer.__unique_id__["64bit_high"] === serverplayer.__unique_id__["64bit_high"]) {
		let ui = this.createEventData("minecraft:load_ui")
		ui.data.path = "main.html"
		this.broadcastEvent("minecraft:load_ui", ui)
	}
}

system.onmenu = function (event) {
    let serverplayer = event.data.serverplayer
	if(clientplayer.__unique_id__["64bit_low"] === serverplayer.__unique_id__["64bit_low"] && clientplayer.__unique_id__["64bit_high"] === serverplayer.__unique_id__["64bit_high"]) {
	   let ui = this.createEventData("minecraft:load_ui")
       ui.data.path = "adminsmenu.html"
       this.broadcastEvent("minecraft:load_ui", ui)
       activate = 1
	}
	   sendUiData = event.data.playerslist
}

system.onUIMessage = function (eventdata) {

		//--
	let eventData = eventdata.data
	if(!eventData) {
        return
	}
	// const chatEventData = clientSystem
	// 		.createEventData("minecraft:display_chat_event");
	// chatEventData.data.message = eventData.data;
	// system.broadcastEvent("minecraft:display_chat_event", chatEventData);
	if(eventData.includes("AdminPanel:givepermission")) {
    	let parseddata = JSON.parse(eventData)
        let eventdata = parseddata.data
        let event = this.createEventData("AdminPanel:givepermission")
        event.data = eventdata
        this.broadcastEvent("AdminPanel:givepermission", event)
	}
	else if(eventData.includes("nbtshiftpressed")) {
		this.close()
    	let parseddata = JSON.parse(eventData)
		shiftdata = parseddata.data
		let ui = this.createEventData("minecraft:load_ui")
        ui.data.path = "nbtshift.html"
        this.broadcastEvent("minecraft:load_ui", ui)
        activate2=1
	}
	else if(eventData.includes("nbtcloseshift")) {
		this.close()
    	let parseddata = JSON.parse(eventData)
		shiftdata = parseddata.data
		let ui = this.createEventData("minecraft:load_ui")
        ui.data.path = "nbt.html"
        this.broadcastEvent("minecraft:load_ui", ui)
		activate2=1
	}
	else if(eventData.includes("closeshift")) {
		this.close()
    	let parseddata = JSON.parse(eventData)
		shiftdata = parseddata.data
		let ui = this.createEventData("minecraft:load_ui")
        ui.data.path = "command.html"
        this.broadcastEvent("minecraft:load_ui", ui)
		activate2=1
	}
	else if(eventData.includes("sendcommandpressed")) {
    	let parseddata = JSON.parse(eventData)
        let eventdata = {}
        eventdata.data = parseddata.data
        eventdata.clientplayer = clientplayer
        let event = this.createEventData("AdminPanel:command")
        event.data = eventdata
        this.broadcastEvent("AdminPanel:command", event)
	}
	else if(eventData.includes("sendnbtpressed")) {
    	let parseddata = JSON.parse(eventData)
        let eventdata = {}
        eventdata.data = parseddata.data
        eventdata.clientplayer = clientplayer
        let event = this.createEventData("AdminPanel:nbt")
        event.data = eventdata
        this.broadcastEvent("AdminPanel:nbt", event)
	}
	else if(eventData.includes("shiftpressed")) {
		this.close()
    	let parseddata = JSON.parse(eventData)
		shiftdata = parseddata.data
		let ui = this.createEventData("minecraft:load_ui")
        ui.data.path = "shift.html"
        this.broadcastEvent("minecraft:load_ui", ui)
        activate2=1
	}
	else if(eventData.includes("closeadminsmenu")) {
		activate=0
		let event = this.createEventData("minecraft:unload_ui")
    	this.broadcastEvent("minecraft:unload_ui", event)
		event.data.path = "adminsmenu.html"
		let ui = this.createEventData("minecraft:load_ui")
       ui.data.path = "main.html"
       this.broadcastEvent("minecraft:load_ui", ui)
    }
	else if(eventData.includes("adminsmenu")&&!eventData.includes("closeadminsmenu")) {
        let event = this.createEventData("AdminPanel:openadminsmenu")
        event.data = clientplayer
        this.broadcastEvent("AdminPanel:openadminsmenu", event)
    }
    else if (eventData === "timepressed") {
        this.time()
    }
    else if(eventData === "closepressed") {
    	this.close()
	}


    else if(eventData === "weatherpressed") {
    	this.weather()
    }
    else if(eventData === "daypressed") {
    	this.day()
    }
    else if(eventData === "nightpressed") {
    	this.night()
    }
    else if(eventData === "midnightpressed") {
    	this.midnight()
    }
    else if(eventData === "clearpressed") {
    	this.clear()
    }
    else if(eventData === "rainpressed") {
    	this.rain()
    }
    else if(eventData === "thunderpressed") {
    	this.thunder()
    }
    else if(eventData === "commandpressed") {
    	this.command()
	}
	else if(eventData === "nbtcommands") {
    	this.close()
	let event = this.createEventData("minecraft:load_ui")
    event.data.path = "nbt.html"
	this.broadcastEvent("minecraft:load_ui", event)
    }
    else if(eventData === "backpressed") {
    	this.back()
	}
	else if(eventData === "helppressed") {
		this.close()
		let event = this.createEventData("minecraft:load_ui")
        event.data.path = "nbthelp.html"
	    this.broadcastEvent("minecraft:load_ui", event)
	}
	else if(eventData === "backhelppressed") {
		this.close()
		let event = this.createEventData("minecraft:load_ui")
        event.data.path = "nbt.html"
	    this.broadcastEvent("minecraft:load_ui", event)
    }
    else if(eventData === "sunrisepressed") {
    	this.sunrise()
    }
    else if(eventData === "sunsetpressed") {
    	this.sunset()
    }
    else if(eventData === "noonpressed") {
    	this.noon()
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

system.time = function () {
	this.close()
	let event = this.createEventData("minecraft:load_ui")
    event.data.path = "time.html"
	this.broadcastEvent("minecraft:load_ui", event)
}

system.weather = function () {
	this.close()
	let event = this.createEventData("minecraft:load_ui")
    event.data.path = "weather.html"
	this.broadcastEvent("minecraft:load_ui", event)
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

system.command = function () {
	this.close()
	let event = this.createEventData("minecraft:load_ui")
    event.data.path = "command.html"
	this.broadcastEvent("minecraft:load_ui", event)
}

system.back = function () {
	this.close()
	let event = this.createEventData("minecraft:load_ui")
    event.data.path = "main.html"
	this.broadcastEvent("minecraft:load_ui", event)
}
