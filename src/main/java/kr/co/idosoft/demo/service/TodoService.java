package kr.co.idosoft.demo.service;

import java.util.List;

import kr.co.idosoft.demo.vo.TodoVO;

public interface TodoService {
	/**
	 * 일정 목록 조회
	 * @return
	 */
	public List<TodoVO> selectTodoList();
	
	/**
	 * 일정 등록
	 * @param vo
	 */
	public int insertTodo(TodoVO vo);
	/**
	 * 일정 삭제
	 * @param vo
	 */
	public int deleteTodo(TodoVO vo);
	/**
	 * 일정 상태 변경
	 * @param vo
	 * @return
	 */
	public int updateTodoState(TodoVO vo);
}
