//import moment from "moment/src/moment";

 // from client to server to open up a websocket 
            // and keep that open
 $(document).ready(function(){
var socket = io()

function scrollToBottom () {
     //selectors
     var messages = jQuery('#messages')
     var newMessage = messages.children('li:last-child')
     //heights props:a cross browser way to fetch the property it works across all the browsers
     var clientHeight = messages.prop('clientHeight')
     var scrollTop = messages.prop('scrollTop')
     var scrollHeight = messages.prop('scrollHeight')
     var newMessageHeight = newMessage.innerHeight()
     var lastMessageHeight = newMessage.prev().innerHeight()
     if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight) {
         messages.scrollTop(scrollHeight)
     }

}
          
socket.on('connect',()=>{
//     console.log('connected to server')
// //emitting from client to the server
//     socket.emit('createEmail',{
//         to : 'xyz@gmail.com',
//         text : 'hi' 
//     })
  var params = jQuery.deparam(window.location.search)
//params is the data that we want to pass to the server
  socket.emit('join',params, function(err) {
     if(err) {//if else
         alert(err)
       //sending user back to root page
       window.location.href='/'

     } else {
         console.log('no error')

     }
  })
})
socket.on('disconnect',()=>{
    console.log('unable to connect')
})

//users = array of names
socket.on('updateUserList',(users)=>{
    console.log('Users list',users)
    var ol = jQuery('<ol></ol>')
    users.forEach(function (user) {
        ol.append(jQuery('<li></li>').text(user));
      })
 jQuery('#users').html(ol)
})

socket.on('newMessage',(message)=>{
    //it will give all the html inside the message-template
    var formattedTime = moment(message.createdAt).format('h:mm a')
    var template = jQuery('#message-template').html()
    var html = Mustache.render(template,{
        text :message.text,
        from:message.from,
        createdAt:formattedTime
    })
    //spitting into browser
    jQuery('#messages').append(html)
     console.log('newMessage',message)
    var formattedTime = moment(message.createdAt).format('h:mm a')
     console.log(formattedTime)
      var li = jQuery('<li></li>')
      li.text(`${message.from} ${formattedTime} :${message.text}`)

    // jQuery('#messages').append(li)
    scrollToBottom()
})
socket.on('newLocationMessage',(message)=>{
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var template = jQuery('#location-message-template').html()
  //store the return value
  var html = Mustache.render(template,{
      from : message.from,
      url:message.url,
      createdAt:formattedTime
  })
  jQuery('#messages').append(html)
     var li = jQuery('<li></li>')
     var a  = jQuery('<a target="_blank">My Location</a>')
     li.text(`${message.from} ${formattedTime} : `)
     a.attr('href',message.url)
     li.append(a)
     jQuery('#messages').append(li)
     scrollToBottom()
    
})

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageTextbox = jQuery('[name=message]')
    socket.emit('createMessage',{
        text : messageTextbox.val()
    },function() {
      messageTextbox.val('')
    })
})

var locationButton = jQuery('#send-location')
locationButton.on('click',()=>{
    if(!navigator.geolocation) {
        return alert('Not supported')
    }
    //disable location button when${formattedTime} someone is typing
    locationButton.attr('disabled','disabled').text('sending current location....')
    navigator.geolocation.getCurrentPosition(function(position) {
        //original value
        locationButton.removeAttr('disabled').text('Send location')
        console.log(position)
        socket.emit('createLocationMessage',{
            latitude : position.coords.latitude,
            longitude:position.coords.longitude
        })
    },function() {
        locationButton.removeAttr('disabled').text('send location')
        alert('unable to fetch location')
    })
})
 })