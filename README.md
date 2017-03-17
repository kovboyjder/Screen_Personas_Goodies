# Screen_Personas_Goodies

use the script as described in this blog.

If you want to listen to the event on the select add this to your script in personas

//Event listener to get the row index stored in event.data
function listener(event){
	session.findById(selectedTable).selectedRowsAbsolute = event.data.toString();
}

//Attach event listener to window
if (window.addEventListener){
  addEventListener("message", listener, false)
} else {
  attachEvent("onmessage", listener)
}
