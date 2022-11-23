package com.example.messagingstompwebsocket;

public class Answer {

	private String name;
	private int questionNumber;

	public Answer() {
	}

	public Answer(String name, int questionNumber) {
		this.name = name;
		this.questionNumber = questionNumber;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getQuestionNumber() {
		return questionNumber;
	}
	public void setQuestionNumber(int num) {
		questionNumber = num;
	}

}
