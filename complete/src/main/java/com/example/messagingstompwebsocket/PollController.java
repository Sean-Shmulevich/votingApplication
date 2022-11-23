package com.example.messagingstompwebsocket;

import javax.xml.stream.events.Comment;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
@RestController
public class PollController {


	@MessageMapping("/hello")
	@SendTo("/topic/sendQuestion")
	public Question greeting(Answer message) throws Exception {
		//Thread.sleep(1000); // simulated delay
		
		return new Question(HtmlUtils.htmlEscape(message.getName()), message.getQuestionNumber());
	}

	@MessageMapping("/userSend")
	@SendTo("/topic/sendResponse")
	public Question userAnswer(Answer message) throws Exception {
		//Thread.sleep(1000); // simulated delay
		return new Question(HtmlUtils.htmlEscape(message.getName()), message.getQuestionNumber());
	}
	Question currQ = new Question("a",-1); 

    @GetMapping("/getProjectNames")
	public Question loadQuest() throws Exception {
		//!RLY BAD CODE 
		//question number is the time remaining in this case
		//and the naame is the number of the question.
		return new Question(currQ.getContent(), currQ.getQuestionNumber());
	}
	@PostMapping("/setQuestion")
	public Question createEmployee(@RequestBody Answer message) throws Exception {
		currQ = new Question(message.getName(), message.getQuestionNumber());
		// System.out.println(message.getName());
		return new Question(HtmlUtils.htmlEscape(message.getName()), message.getQuestionNumber());
	}

	//make a web socket for the results page to get the answers in real time. 

	@RequestMapping(value = "/staticPage", method = RequestMethod.GET)
	public String redirect() {
		return "redirect:/admin.html";
	}

}
