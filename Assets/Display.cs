using UnityEngine;
using UnityEngine.UI;
using System.Collections;



public class Display : MonoBehaviour {

	Text txt;
	public int score = 0;

	// Use this for initialization
	void Start () {
		txt = gameObject.GetComponent<Text>();
	}
	
	// Update is called once per frame
	void Update () {
		txt.text = "Score = " + score + "/3";
	}
}
