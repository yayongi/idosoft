package kr.co.idosoft.demo.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.idosoft.demo.dao.TodoDao;
import kr.co.idosoft.demo.vo.TodoVO;

@Service
public class TodoServiceImpl implements TodoService {
	@Resource TodoDao dao;
	/**
	 * 일정 목록 조회
	 * @return
	 */
	@Override
	public List<TodoVO> selectTodoList() {
		return dao.selectTodoList();
	}
	/**
	 * 일정 등록
	 */
	@Override
	public int insertTodo(TodoVO vo) {
		return dao.insertTodo(vo);
	}
	/**
	 * 일정 삭제
	 */
	@Override
	public int deleteTodo(TodoVO vo) {
		return dao.deleteTodo(vo);
	}
	/**
	 * 일정 상태 변경
	 */
	@Override
	public int updateTodoState(TodoVO vo) {
		return dao.updateTodoState(vo);
	}
}
