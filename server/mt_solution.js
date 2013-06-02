if (Meteor.isServer) {
	var perPage = 3;
	MessagesCollection = new Meteor.Collection("messages");
	Meteor.methods({
		newMessage: function(newM){
			MessagesCollection.insert({message: newM, date: Date.now()});
		},
		removeMessage: function(id){
			MessagesCollection.remove({_id: id});
		},
		updateMessage: function(id, uMessage){
			MessagesCollection.update({_id: id}, {message: uMessage, date: Date.now()});
		}
	});	
	Meteor.publish("page", function(page){
		page -= 1;
		if(page < 0) page = 0;
		var start = page * perPage;
		return MessagesCollection.find({}, {sort: { date: -1}, skip: start, limit: perPage, fields: {}});
	});
	Meteor.publish("more", function (page) {
		page -= 1;
		if(page < 0) page = 0;
		var start = page * perPage + perPage, isVisibleCursor, observerHandle, self = this;
		isVisibleCursor = MessagesCollection.find({}, {sort: { date: -1}, limit: start, fields: {}});
		
		_.each(isVisibleCursor.fetch(), function(e, i){
			self.added("more_message", e._id, e);
		}, self);		
		observerHandle = isVisibleCursor.observeChanges({
			added: function (idx, doc) {				
				console.log('MessagesCollection added '+ idx);
				if(idx){
					self.added("more_message", idx, doc);
					self.ready();
				}								
			},
			changed: function (idx, doc) {				
				console.log('MessagesCollection changed '+ idx);
				if(idx){
					self.changed("more_message", idx, doc);
					self.ready();
				}
			},
			removed: function (idx) {
				console.log('MessagesCollection removed '+ idx);
				if(idx){
					self.removed("more_message", idx);
					self.ready();
				}					
			}
		});		
		self.ready();
		self.onStop(function () {
			observerHandle.stop();
		});
	});
	Meteor.publish("count", function () {		
		var docId = Meteor.uuid(), isVisibleCursor = MessagesCollection.find({}, {sort: { date: -1}}), count = 0, self = this;
		self.added("count_message", docId, {count: count});				
		observerHandle = isVisibleCursor.observeChanges({
			added: function (idx, doc) {				
				if(idx){
					count ++;
					console.log('MessagesCollection count added '+ count);
					self.changed("count_message", docId, {count: count});
					self.ready();
				}				
			},
			removed: function (idx) {				
				if(idx){
					count--;
					console.log('MessagesCollection count removed '+ count);
					self.changed("count_message", docId, {count: count});
					self.ready();
				}
			}
		});		
		self.ready();
		self.onStop(function () {
			observerHandle.stop();
		});
	});
	Meteor.startup(function () {
	// code to run on server at startup
	});
}
