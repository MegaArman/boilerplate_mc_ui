const system = server.registerSystem(0, 0)
let command = "minecraft:execute_command"
let clientplayer
let players = []
let y = 0
let joined
let data

system.initialize = function () {
	this.registerEventData("AdminPanel:loadui", {})
	this.registerEventData("AdminPanel:loadmenu", {})
	this.listenForEvent("AdminPanel:givepermission", (event) => this.givepermission(event))
	this.listenForEvent("AdminPanel:openadminsmenu", (event) => this.openadminsmenu(event))
	this.listenForEvent("AdminPanel:addplayer", (event) => this.addplayer(event))
	this.listenForEvent("minecraft:block_interacted_with", (eventData) => this.onUsed(eventData))
	this.command("scoreboard objectives add PanelAdmins dummy admins")
	this.listenForEvent("AdminPanel:command", (event) => this.runcommand(event))
	this.listenForEvent("AdminPanel:nbt", (event) => this.runnbtcommand(event))
	this.listenForEvent("AdminPanel:day", () => this.command("time set day"))
	this.listenForEvent("AdminPanel:night", () => this.command("time set night"))
	this.listenForEvent("AdminPanel:midnight", () => this.command("time set midnight"))
	this.listenForEvent("AdminPanel:clear", () => this.command("weather clear"))
	this.listenForEvent("AdminPanel:rain", () => this.command("weather rain"))
	this.listenForEvent("AdminPanel:thunder", () => this.command("weather thunder"))
	this.listenForEvent("AdminPanel:noon", () => this.command("time set noon"))
	this.listenForEvent("AdminPanel:sunset", () => this.command("time set sunset"))
	this.listenForEvent("AdminPanel:sunrise", () => this.command("time set sunrise"))
	
}
 
system.runcommand = function (event) {
	let name = this.getComponent(event.data.clientplayer, "minecraft:nameable")
	let eventdata = this.createEventData(command)
	eventdata.data.command = `/execute @p[name=${name.data.name}] ~~~ ${event.data.data}`
	this.broadcastEvent(command, eventdata)
}

system.runnbtcommand = function (event) {

	data=event.data.data.split(/\s+/);
	let type1;
	if(data[0]=="item") {  type1="item_entity";}
	else type1="entity"
	let identifier=data[1];
	let entity=this.createEntity(type1, identifier);
	if(!(data[2].includes("position:")||data[3].includes("position:")||data[4].includes("position:"))) {
		let ppos=this.createComponent(event.data.clientplayer, "minecraft:position").data
		let epos=this.createComponent(entity, "minecraft:position")
		epos.data.x=ppos.x
		epos.data.y=ppos.y
		epos.data.z=ppos.z
		this.applyComponentChanges(entity, epos);
	}
	this.continue(entity)
}

system.continue = function (entity) {
	for(i=2;i<data.length;i++) {
		if(data[i].includes("name:")) {
			let name=data[i].replace("name:","");
			let namecom = this.createComponent(entity, "minecraft:nameable");
			namecom.data.name = name;
			this.applyComponentChanges(entity, namecom);
		}
		else if(data[i].includes("health:")) {
			let health = data[i].replace("health:", "");
			let healthcom = this.createComponent(entity, "minecraft:health");
			healthcom.data.value = JSON.parse(health);
			healthcom.data.max = JSON.parse(health);
			this.applyComponentChanges(entity, healthcom);
		}
		else if(data[i].includes("position:")) {
			let position=data[i].replace("position:","").split(',');
			let poscom = this.createComponent(entity, "minecraft:position");
			poscom.data.x=JSON.parse(position[0]);
			poscom.data.y=JSON.parse(position[1]);
			poscom.data.z=JSON.parse(position[2]);
			this.applyComponentChanges(entity, poscom);
		}
	}
		
		
	
}

system.addplayer = function (event) {
	players.push(event.data)
	joined = this.getComponent(event.data, "minecraft:nameable").data.name
	this.executeCommand("testfor @a[tag=PanelAdmins]", (feedback) => this.feedBack(feedback))
}

system.feedBack = function (feedback) {
	let string = JSON.stringify(feedback)
	if(string.includes("No target")) {
		this.command(`tag @p[name=${joined}] add PanelAdmins`)
		this.command(`scoreboard players set ${joined} PanelAdmins 1`)
	}
}

system.openadminsmenu=function (event) {
	let name=this.getComponent(event.data, "minecraft:nameable").data.name
	this.executeCommand("testfor @p[name="+name+",tag=PanelAdmins]", (result) => this.result(result,event))
}

system.givepermission = function (event) {
	this.command(`scoreboard players set ${event.data} PanelAdmins 1`)
}

system.onUsed = function(eventData) {
	let player = eventData.data.player
	let handContainer = system.getComponent(player, "minecraft:hand_container")
	let item = handContainer.data[0]
	if(player.__identifier__ == "minecraft:player") {
	  if(item.item == "adminpanel:adminpanel") {
		  let name = this.getComponent(player, "minecraft:nameable")
		  this.executeCommand(`scoreboard players test @p[name=${name.data.name}] PanelAdmins 1 1`, (result) => this.openEditor(result,eventData))
	  }
   }
}

system.openEditor = function(result,eventData) {
		let stringresult = JSON.stringify(result)
		if(!stringresult.includes("NOT") && !stringresult.includes("no")) {
		let event = system.createEventData("AdminPanel:loadui")
		event.data=eventData
		system.broadcastEvent("AdminPanel:loadui", event)
	  }
}

system.result = function(result,event) {
  let player = event.data
  let stringresult = JSON.stringify(result)
  if(stringresult.includes("Found")) {
	  let event = system.createEventData("AdminPanel:loadmenu")
		event.data = {}
		event.data.serverplayer=player
		y=0
		let names = []
		for(let x=0; x<players.length; x++) {
		  let playername = system.getComponent(players[y++], "minecraft:nameable")
		  names.push(playername.data.name)
		}
		event.data.playerslist = names
		system.broadcastEvent("AdminPanel:loadmenu", event)
  }
}

system.command = function(command) {
	  let data = this.createEventData("minecraft:execute_command")
	  data.data.command = command
	  this.broadcastEvent("minecraft:execute_command", data)
}