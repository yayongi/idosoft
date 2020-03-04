package kr.co.idosoft.demo.controller;

import java.util.List;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.co.idosoft.demo.service.DemoService;
import kr.co.idosoft.demo.vo.DemoVO;

/**
 * Handles requests for the application home page.
 */
@Controller
public class DemoController {
	
	private static final Logger logger = LoggerFactory.getLogger(DemoController.class);
	
	@Resource 	DemoService service;
	
	
	 /**
     * Tiles를 사용(header, left, footer 포함)
     */        
    @RequestMapping("/demoComm.ido")
    public ModelAndView demoPage(Model model, DemoVO vo) {
    	
    	logger.info("info : Welcome demo!");
    	
    	ModelAndView mv = new ModelAndView("demo/demoPage.comm");
    	
    	Integer testCnt = service.selectTestCnt(vo);
    	List<DemoVO> testList = service.selectTestList(vo);
    	
    	model.addAttribute("testCnt", testCnt );
    	model.addAttribute("testList", testList );
    	
    	return mv;
    }
    
    /**
     * Tiles를 사용(header, left, footer 제외)
     */    
    @RequestMapping("/demoEmpt.ido")
    public ModelAndView demoEmpt(Model model, DemoVO vo) {
    	
    	logger.info("info : Welcome demo!");
    	
    	ModelAndView mv = new ModelAndView("demo/demoPage.empt");
    	
    	Integer testCnt = service.selectTestCnt(vo);
    	List<DemoVO> testList = service.selectTestList(vo);
    	
    	model.addAttribute("testCnt", testCnt );
    	model.addAttribute("testList", testList );
    	
    	return mv;
    }
    
    @GetMapping("/{name}.ido")
	public String page(@PathVariable String name, Model model){
		model.addAttribute("pageName", name);
		return "/demo/page";
	}
}
