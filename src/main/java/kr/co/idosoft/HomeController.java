package kr.co.idosoft;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import kr.co.idosoft.demo.dao.DemoDao;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {
	
	private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	/**
	 * Simply selects the home view to render by returning its name.
	 */
	
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home2(Locale locale, Model model) {
		logger.info("Welcome home! The client locale is {}.", locale);
		
		Date date = new Date(); DateFormat dateFormat =
		DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
		
		return "home";
	}
	
	/**
     * Tiles를 사용(header, left, footer 포함)
     */        
    @RequestMapping("/homeComm.ido")
    public String testPage(Locale locale, Model model) {
    	
    	logger.trace("trace : Welcome home! The client locale is {}.", locale);
    	logger.debug("debug : Welcome home! The client locale is {}.", locale);
    	logger.info("info : Welcome home! The client locale is {}.", locale);
    	logger.warn("warn : Welcome home! The client locale is {}.", locale);
    	logger.error("error : Welcome home! The client locale is {}.", locale);
    	
    	System.out.println("logback !!!");
		
		Date date = new Date(); DateFormat dateFormat =
		DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
        return "home.comm";
    }
    
    /**
     * Tiles를 사용(header, left, footer 제외)
     */    
    @RequestMapping("/homeEmpt.ido")
    public String testPart(Locale locale, Model model) {
    	
    	logger.info("Welcome home! The client locale is {}.", locale);
		
		Date date = new Date(); DateFormat dateFormat =
		DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);
		
		String formattedDate = dateFormat.format(date);
		
		model.addAttribute("serverTime", formattedDate );
        
        return "home.empt";
    }        
    
}
