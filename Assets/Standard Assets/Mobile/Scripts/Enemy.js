#pragma strict
	
function OnControllerColliderHit(hit : ControllerColliderHit){
     if(hit.gameObject.tag == ("Ground")){
         rigidbody.velocity = - rigidbody.velocity;
         }
}
function Update () {
	rigidbody.velocity = Vector3(2,0,0);
	
}