package com.example.messagingstompwebsocket;

public class Question {

	private String content;
	private int questionNumber;

	public Question() {
	}

	public Question(String content, int questionNumber) {
		this.content = content;
		this.questionNumber = questionNumber;
	}

	public String getContent() {
		return content;
	}

	public void setQuestionNumber(int questionNumber) {
		this.questionNumber = questionNumber;
	}

    public int getQuestionNumber() {
        return questionNumber;
	}

}
