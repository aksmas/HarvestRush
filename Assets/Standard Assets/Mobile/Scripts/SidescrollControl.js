//////////////////////////////////////////////////////////////
// SidescrollControl.js
//
// SidescrollControl creates a 2D control scheme where the left
// pad is used to move the character, and the right pad is used
// to make the character jump.
//////////////////////////////////////////////////////////////

#pragma strict

@script RequireComponent( CharacterController )

// This script must be attached to a GameObject that has a CharacterController
var moveTouchPad : Joystick;
var jumpTouchPad : Joystick;
var facingRight = false;
var anim: Animator;
public var collected : int = 0;
var forwardSpeed : float = 4;
var backwardSpeed : float = 4;
var jumpSpeed : float = 16;
var inAirMultiplier : float = 0.25;					// Limiter for ground speed while jumping

private var thisTransform : Transform;
private var character : CharacterController;
private var velocity : Vector3;						// Used for continuing momentum while in air
private var canJump = true;

function Start()
{
	// Cache component lookup at startup instead of doing this every frame		
	thisTransform = GetComponent( Transform );
	character = GetComponent( CharacterController );
	anim = GetComponent(Animator);	

	// Move the character to the correct start position in the level, if one exists
	var spawn = GameObject.Find( "PlayerSpawn" );
	if ( spawn )
		thisTransform.position = spawn.transform.position;
}

function OnControllerColliderHit(hit : ControllerColliderHit){
     if(hit.gameObject.tag == ("Finish")){
         collected += 1;
         hit.collider.gameObject.active = false;
         }
     if((hit.gameObject.tag == ("Respawn")) && collected == 3){
         collected = 0;
         OnEndGame();
     }
}

function Flip()
 {
     facingRight = !facingRight;
     var theScale = transform.localScale;
     theScale.x *= -1;
     transform.localScale = theScale;
 }

function OnEndGame()
{
	// Disable joystick when the game ends	
	moveTouchPad.Disable();	
	jumpTouchPad.Disable();	

	// Don't allow any more control changes when the game ends
	this.enabled = false;
	
	yield WaitForSeconds(3);
	Application.LoadLevel(0);
	
}

function Update()
{
	var movement = Vector3.zero;

	// Apply movement from move joystick
	if ( moveTouchPad.position.x > 0 ){
		movement = Vector3.right * forwardSpeed * moveTouchPad.position.x;
		if (facingRight) Flip();
		}
	else if (moveTouchPad.position.x < 0){
		movement = Vector3.right * backwardSpeed * moveTouchPad.position.x;
		if (!facingRight)Flip();
		}
		
		anim.SetFloat ("Speed", Mathf.Abs(moveTouchPad.position.x));
	
	// Check for jump
	if ( character.isGrounded )
	{		
		var jump = false;
		var touchPad = jumpTouchPad;
			
		if ( !touchPad.IsFingerDown() ){
			canJump = true;
			anim.SetBool ("onGround", true);
		}
		
	 	if ( canJump && touchPad.IsFingerDown() )
	 	{
			jump = true;
			canJump = false;
			anim.SetBool ("onGround", false);
	 	}	
		
		if ( jump )
		{
			// Apply the current movement to launch velocity		
			velocity = character.velocity;
			velocity.y = jumpSpeed;	
		}
	}
	else
	{			
		// Apply gravity to our velocity to diminish it over time
		velocity.y += Physics.gravity.y * Time.deltaTime;
				
		// Adjust additional movement while in-air
		movement.x *= inAirMultiplier;
//		movement.z *= inAirMultiplier;
	}
		
	movement += velocity;	
	movement += Physics.gravity;
	movement *= Time.deltaTime;
	
	// Actually move the character	
	character.Move( movement );
	
	if ( character.isGrounded )
		// Remove any persistent velocity after landing	
		velocity = Vector3.zero;
		
	if (Input.GetKeyDown(KeyCode.Escape)) 
    Application.Quit();
}