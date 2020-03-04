package kr.co.idosoft.demo.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.idosoft.demo.service.TodoService;
import kr.co.idosoft.demo.vo.TodoVO;

/**
 * 일정관리를 위한 컨트롤러
 * @author 유경이
 */
@Controller
public class TodoController {
	private static final Logger LOG = LoggerFactory.getLogger(TodoController.class);
	@Resource TodoService service;
	
	/**
	 * 일정목록 조회
	 * @param model
	 * @param vo
	 * @return
	 */
	@RequestMapping(value="/todo/list", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getTodoList(Model model) {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/todo/list");
		}
		Map<String, Object> data = new HashMap<String, Object>();
		// 일정목록 조회
		List<TodoVO> todoList = service.selectTodoList();
		
		data.put("todoList", todoList);

		return data;
	}
	
	/**
	 * 일정 등록
	 * @param model
	 * @param vo
	 * @return
	 */
	@RequestMapping(value="/todo/item/{text}", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> insertTodo(@PathVariable String text, TodoVO vo) throws Exception {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/todo/item/{text}", text);
		}
		Map<String, Object> data = new HashMap<String, Object>();
		
		int id = service.insertTodo(vo);	// 일정 등록
		
		data.put("id", id);	// 등록 성공으로 리턴
		
		return data;
	}
	
	/**
	 * 일정 삭제
	 * @param id
	 * @param vo
	 * @return
	 */
	@RequestMapping(value="/todo/item/{id}", method=RequestMethod.DELETE)
	@ResponseBody
	public Map<String, Object> deleteTodo(@PathVariable String id, TodoVO vo) throws Exception {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/todo/item/{id}", id);
		}
		Map<String, Object> data = new HashMap<String, Object>();
		
		int result = service.deleteTodo(vo);	// 일정 삭제
		
		if(result == 0) {
			throw new Exception("삭제할 일정이 없습니다.");
		}
		data.put("result", result);
		
		return data;
	}
	
	/**
	 * 일정 완료여부 변경
	 * @param id
	 * @param vo
	 * @return
	 */
	@RequestMapping(value="/todo/item/state/{id}/{completeYn}", method=RequestMethod.PUT)
	@ResponseBody
	public Map<String, Object> updateTodoState(@PathVariable String id, TodoVO vo) throws Exception {
		if(LOG.isDebugEnabled()) {
			LOG.debug("/todo/item/state/{id}", id);
		}
		Map<String, Object> data = new HashMap<String, Object>();
		
		int result = service.updateTodoState(vo);	// 일정 삭제
		
		data.put("result", result);
		
		return data;
	}
}
