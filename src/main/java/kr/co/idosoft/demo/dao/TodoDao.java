package kr.co.idosoft.demo.dao;

import java.util.List;

import kr.co.idosoft.demo.vo.TodoVO;

/**
 * 일정관리 Repository 구현객체
 * @author 유경이
 *
 */
public interface TodoDao {
	/**
	 * 일정목록 조회
	 * @return
	 */
	public List<TodoVO> selectTodoList();
	/**
	 * 일정 등록
	 * @param text
	 */
	public int insertTodo(TodoVO vo);
	
	/**
	 * 일정 삭제
	 * @param text
	 */
	public int deleteTodo(TodoVO vo);
	/**
	 * 일정 상태 변경
	 * @param vo
	 * @return
	 */
	public int updateTodoState(TodoVO vo);
}
