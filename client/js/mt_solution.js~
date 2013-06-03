if (Meteor.isClient) {
	MessagesCollection = new Meteor.Collection("messages");
	MMessagesCollection = new Meteor.Collection("more_message");
	CountMessagesCollection = new Meteor.Collection("count_message");
	Session.setDefault('messageSelect', null);
	Session.setDefault('pagePost', 1);
	Deps.autorun(function () {
		Meteor.subscribe("page", [Session.get('pagePost')], function () {
			console.log("post subscription complete!");
			console.log(MessagesCollection.find({}));
		});
	});
	
	Session.setDefault('morePost', 1);
	Deps.autorun(function () {
		Meteor.subscribe("more", [Session.get('morePost')], function () {
			console.log("more subscription complete!");
			console.log(MMessagesCollection.find({}));
		});
	});
	
	Meteor.subscribe("count", [],function () {
		console.log("count subscription complete!");
		console.log(CountMessagesCollection.findOne({}));
	});	

	Template.page.helpers({
		messages: function () {
			return MessagesCollection.find({}, {sort: { date: -1}}).fetch();
		},
		count: function () {
			var c = CountMessagesCollection.findOne({}), html = '';
			if(c){
				var page = Math.ceil(c.count/3)+1, currentPage = parseInt(Session.get('pagePost')), hPage = bPage = fPage = '', pageStart = parseInt(currentPage)-2, pageEnd = parseInt(currentPage)+2;
console.log(pageEnd+"|"+currentPage);
				if(pageStart <= 1){
					pageStart = 1;
				}
				else{
					hPage = '<a data-href="1" class="page-content"><span class="button-content">1</span></a><b>←</b>';
				}
				if(pageEnd>=page){
					pageEnd = page;
				}
				else {
					fPage = '<b>→</b>'+'<a data-href="'+(page-1)+'" class="page-content"><span class="button-content">'+(page-1)+'</span></a>';
				}				
				for(var i = pageStart; i < pageEnd; i++){
					bPage += '<a data-href="'+i+'" class="page-content"><span class="button-content">'+i+'</span></a>';
				}
				
				html = hPage + bPage + fPage ;
				return new Handlebars.SafeString(html);
			}				
			return 0;
		},
		page_nav: function(){
			var c = CountMessagesCollection.findOne({});
			if(c){
				var page = Math.ceil(c.count/3);
				return 'Page '+Session.get('pagePost')+"/"+page;
			}
			return 'None';
		}
	});
	Template.more.helpers({
		messages: function () {
			return MMessagesCollection.find({}, {sort: { date: -1}}).fetch();
		}
	});
	/**
	Template.edit.helpers({
		message: function () {
			var id = MessagesCollection.findOne({_id: Session.get('messageSelect')});
			if(id)
				return id.message;
			return '';
		}
	});
	*/
	Template.addTemplate.events({
		'keypress': function(e, t){			
			if(e.charCode == 13){
				e.preventDefault();
				Meteor.call('newMessage', t.find('input').value);
				t.find('input').value = '';
			}			
		}
	});
	Template.page.events({
		'click .page-content': function(e, t){
			Session.set('pagePost', $(e.currentTarget).attr('data-href'));
			e.preventDefault();
		},
		'click i.icon-remove': function(e, t){			
			Meteor.call('removeMessage', this._id);
			e.preventDefault();
		},
		'click i.icon-pencil': function(e, t){		
			Session.set('messageSelect', this._id);
			var id = MessagesCollection.findOne({_id: this._id});
			if(id){
				$('.edit-input').val(id.message);
				$('#edit-message').modal('show');
			}				
			e.preventDefault();
		}		
	});
	Template.more.events({
		'click .more': function(e, t){
			var g = Session.get('morePost');
			g++;
			var c = CountMessagesCollection.findOne({});
			var page = Math.ceil(c.count/3);
			if(g > page) g = page;
			Session.set('morePost', g);
			e.preventDefault();
		},
		'click .less': function(e, t){
			var g = Session.get('morePost');
			g--;
			if(g<=0) g = 1;
			Session.set('morePost', g);
			e.preventDefault();
		},
		'click i.icon-remove': function(e, t){			
			Meteor.call('removeMessage', this._id);
			e.preventDefault();
		},
	});
	Template.edit.events({
		'click .btn-primary': function(e, t){
			Meteor.call('updateMessage', Session.get('messageSelect'), t.find('.edit-input').value, function (error, result){
				if(error){
					$('#edit-message').modal('show');
				}				
			});
			$('#edit-message').modal('hide');
			e.preventDefault();
		}
	});
}
