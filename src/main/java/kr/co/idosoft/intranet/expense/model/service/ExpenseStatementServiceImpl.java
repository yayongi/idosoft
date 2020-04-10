package kr.co.idosoft.intranet.expense.model.service;

import java.util.Map;

import javax.annotation.Resource;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import kr.co.idosoft.common.util.commonUtil;
import kr.co.idosoft.intranet.expense.model.dao.ExpenseStatementDaoImpl;

/**
 * 
 * @author 유기환
 * @since 2020.03.30
 * @content ExpenseStatement Service
 */

@Service
public class ExpenseStatementServiceImpl implements ExpenseStatementService {
	
	private static final Logger LOG = LoggerFactory.getLogger(ExpenseStatementServiceImpl.class);
	
	@Resource
	ExpenseStatementDaoImpl dao;
	
	@Override
	public List<Map<String, Object>> getlist(Map<String, Object> data) {
		return dao.getlist(data);
	}

	@Override
	public List<Map<String, Object>> getView(Map<String, Object> data) {
		return dao.getView(data);
	}

	@Override
	public String getTotalAmount(Map<String, Object> data) {
		return dao.getTotalAmount(data);
	}
	
	@Override
	public String getIndiTotalAmount(Map<String, Object> data) {
		return dao.getIndiTotalAmount(data);
	}
	
	@Override
	public List<Map<String, Object>> getCommExpenseList(Map<String, Object> data) {
		return dao.getCommExpenseList(data);
	}
	@Override
	public List<Map<String, Object>> getTransExpenseList(Map<String, Object> data) throws Exception {
		
		List<Map<String, Object>> 	dataList 	= dao.getTransExpenseList(data);
		List<String>				memberList 	= dao.getMemberList(data);
		
		return batchProcessing(dataList, memberList, (String)data.get("YEAR"), (String)data.get("isAdmin"));
	}

	// 교통비 일괄 처리 프로세스
	static List<Map<String, Object>> batchProcessing(List<Map<String, Object>> dataList, List<String> membetList, String year, String isAdmin) throws Exception { // 월별 일괄 계산 처리
		
		LOG.debug("## 교통비 일괄 처리 프로세스 START #######################################################");
		
		String[] 	monthKeyArray 	= {"Jan", "Fab", "Mar", "Apr", "May", "June", "July","Aug", "Sept", "Oct", "Nov", "Dec"};
		int[] 		monthArr 		= {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12};
		
		List<Map<String, Object>> transList = new ArrayList<Map<String,Object>>();
		
		SimpleDateFormat stringToDate 		= new SimpleDateFormat("yyyy-MM-dd");	// 문자열 -> date
		SimpleDateFormat dateToMonth 		= new SimpleDateFormat("MM");			// date -> 달
		SimpleDateFormat dateToDay 			= new SimpleDateFormat("dd");			// date -> 일
		
		// 회원 목록
		for(int i = 0; i < membetList.size(); i++) {
			Map<String, Object> monthMap = new HashMap<String, Object>();

			// 달에 대한 LOOP
			for(int j = 0; j < monthArr.length; j++) {
				
				//LOG.debug("# month : " + monthKeyArray[j]);
				
				// 그달 경비 리스트 (중복된 직원번호 존재시 누적 처리) 
				List <Double[]> monthExpenseList = new ArrayList<Double[]>();	
				
				double monthTotal = 0.0;
				
				// dataList
				for(int k = 0; k < dataList.size(); k++) {
					
					if(membetList.get(i).equals(dataList.get(k).get("mno"))) {
						
						Date startDate	= stringToDate.parse((String) dataList.get(k).get("startDate")); 	// 시작날짜
						Date endDate 	= stringToDate.parse((String) dataList.get(k).get("endDate"));		// 종료날짜
						
						int startMonth 	= Integer.parseInt(dateToMonth.format(startDate)); 					// 시작달
						int endMonth 	= Integer.parseInt(dateToMonth.format(endDate)); 					// 종료달
						
						double amount 	= (double)((int) dataList.get(k).get("ct")); 						// 월 총 경비
						
						//LOG.debug("# amount : " + amount);
						
						/*1. 종료날짜가  해당 월보다 크거나 같은지 시작날짜가 해당월보다 작거나 같은지 체크 */
						if(startMonth <= monthArr[j] && monthArr[j] <= endMonth) {
							// 기준달 - 그달의 마지막일자를 구할 때 사용
							String baseMonth = year + "-" + ( monthArr[j] > 9 ? monthArr[j] : "0"+monthArr[j]) + "-01";
							
							// 그달의 마지막 일자
							int lastDate = commonUtil.LastDateInMonth(baseMonth);
							
							// 일경비 (월경비/그달의 일수)
							Double transExpense =  (amount/lastDate);	
							//LOG.debug("# transExpense : " + transExpense);
							
							// 그달의 경비를 저장하는 배열(일)[그달의 마지막 일]
							Double[] monthExpenseArr = new Double[lastDate];
							
							// 그달의 일에 대한 LOOP
							/* 1. true : 2. 해당 월에 시작하는 날짜인지 체크  */
							if(monthArr[j] == startMonth) {
								/* 2. true : 3. 시작날짜와 종료날짜가 같은 달 인지 여부 - 시작일과 종료일이 같은 달인 경우 */ 
								if(startMonth == endMonth) {
									LOG.debug("# startMonth : " + startMonth);
									//LOG.debug("# endMonth : " + endMonth);
									LOG.debug("startMonth와 endMonth 현재 달에 포함되어있는지 추출");
									
									// SimpleDateFormat 이용하여 해당 날짜의 일수 추출
									int startDay = 0;
									
									// 시작일이 첫째주이면서 월요일인 경우, 첫날부터 시작 (2020-04-10 요건 수용)
									if(commonUtil.getWeekOfYear(stringToDate.format(startDate)) == 1 && "월".equals(commonUtil.getDateDay(stringToDate.format(startDate)))) {
										startDay = 0;
									} else {
										// 시작일이 0부터  시작하기 때문에 -1
										startDay 	= Integer.parseInt(dateToDay.format(startDate)) -1;
									}

									int endDay 		= Integer.parseInt(dateToDay.format(endDate));
									
									// 시작날짜와 종료날짜가 같은 달이기 때문에, 1일 부터 시작날짜 까지 0.0 대입
									for(int l = 0; l < startDay; l++) {
										monthExpenseArr[l] = 0.0;
										LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									// 시작날짜부터 종료날짜 까지 일경비 대입
									for(int l = startDay; l < endDay; l++) {
										monthExpenseArr[l] = transExpense;
										LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									// 종료일 부터 월의 마지막 날까지 0.0 대입
									for(int l = endDay; l < lastDate; l++) {
										monthExpenseArr[l] = 0.0;
										LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								} else {
									/* 3. false : 시작날짜부터 달의 마지막 날짜까지 일 수 계산*/
									//LOG.debug("시작날짜부터 달의 마지막 날짜까지 일 수 계산");
									
									// SimpleDateFormat 이용하여 해당 날짜의 일수 추출
									int startDay = 0;
									
									// 시작일이 첫째주이면서 월요일인 경우, 첫날부터 시작 (2020-04-10 요건 수용)
									if(commonUtil.getWeekOfYear(stringToDate.format(startDate)) == 1 && "월".equals(commonUtil.getDateDay(stringToDate.format(startDate)))) {
										startDay = 0;
									} else {
										// 시작일이 0부터  시작하기 때문에 -1
										startDay 	= Integer.parseInt(dateToDay.format(startDate)) -1;
									}
									
									// (시작날짜는 그달에 해당)시작날짜와 종료날짜가 같지 않기 때문에, 1일부터 시작날짜까지 0.0 대입
									for(int l = 0; l < startDay; l++) {
										monthExpenseArr[l] = 0.0;
										LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									// 시작날짜부터 그달의 마지막 일까지 일경비 대입  
									for(int l = startDay; l < lastDate; l++) {
										// startMonth와 endMonth 현재 달에 포함되어있는지 추출
										monthExpenseArr[l] = transExpense;
										LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								}
							} else { // 그달이 시작날짜가 아닌 경우,
								/* 2. false :  4. 해당 월에 종료되는 날짜인지 체크 */
								if(monthArr[j] == endMonth) {
									/* 4. true : 그달의 첫 날부터 종료 일 수 까지 계산  */
									LOG.debug("그달의 첫 날부터 종료 일 수 까지 계산");
									
									int endDay 	= Integer.parseInt(dateToDay.format(endDate));
									//LOG.debug("# endDay : " + endDay);
									
									// 그달의 시작날짜가 아니고 그달에 종료날짜가 있기 때문에 1일부터 마지막 날짜까지 일경비 대입
									for(int l = 0; l < endDay; l++) {
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
									
									// 마지막날짜 기준으로 그달의 마지막 일까지 0.0 대입
									for(int l = endDay; l < lastDate; l++) {
										monthExpenseArr[l] = 0.0;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								} else { // 시작날짜와 종료날짜가 그달에 없는 경우, (그달을 포함하고 있는 경우)
									/* 4. false : 그달의 첫 날부터 마지막 일 수 까지 계산  */
									LOG.debug("그달의 첫 날부터 마지막 일 수 까지 계산");
									
									for(int l = 0; l < lastDate; l++) {
										// startMonth와 endMonth 현재 달에 포함되어있는지 추출
										monthExpenseArr[l] = transExpense;
										//LOG.debug("# monthExpenseArr["+l+"] : " + monthExpenseArr[l]);
									}
								}
							}
							/*1. 종료날짜가  해당 월보다 작거나 같은지 체크 */
							/* 1. true : 2. 해당 월에 시작하는 날짜인지 체크  */
							/* 2. true : 3. 시작날짜와 종료날짜가 같은 달 인지 여부 	 */ 
							/* 2. false :  4. 해당 월에 종료되는 날짜인지 체크 */
							/* 3. true : 시작날짜부터 종료일 까지 일 수를 계산*/
							/* 3. false : 시작날짜부터 달의 마지막 날짜까지 일 수 계산*/
							/* 4. true : 그달의 첫 날부터 종료 일 수 까지 계산  */
							/* 4. false : 그달의 첫 날부터 마지막 일 수 까지 계산  */
							monthExpenseList.add(monthExpenseArr);
						}
						
					}
				}
				
				// 중복된 ROW를 가지고 있는 경우, 
				if(monthExpenseList.size() > 1) {
					LOG.debug("# 중복된 ROW를 가지고 있는 경우, 중복 ROW 개수 : " + monthExpenseList.size());
					
					// 리스트에 가지고 있는 첫번째 배열 길이를 기준으로 tempArr 배열 생성
					Double[] tempArr = new Double[monthExpenseList.get(0).length];
					
					// 모든 배열을 0.0으로 초기화(비교) 
					for(int k = 0; k < tempArr.length; k++) {
						tempArr[k] = 0.0;
					}
					
					for(int k = 0; k < monthExpenseList.size(); k++) {
						// 해당 
						for(int l = 0; l < tempArr.length; l++) {
							Double temp = monthExpenseList.get(k)[l];
							
							// 배열안에 있는 값보다 temp가 클 경우, 배열에 temp를 대입한다. 가장 높은 일 경비를 저장
							if(tempArr[l] < temp) {
								tempArr[l] = temp;
							}
							//LOG.debug("# tempArr[" + l + "] : " + tempArr[l]);
						}
					}
					
					// 월 경비 합계 계산
					for(int k = 0; k < tempArr.length; k++) {
						monthTotal += tempArr[k];
					}
					
				} else if(monthExpenseList.size() == 1){ // 중복된 ROW를 가지고 있지 않은 경우,
					LOG.debug("# 중복된 ROW를 가지고 있지 않은 경우, ");
					Double[] tempArr = new Double[monthExpenseList.get(0).length];
					
					// 월 경비 합계 계산
					for(int k = 0; k < tempArr.length; k++) {
						//LOG.debug("# tempArr["+k+"] : " + monthExpenseList.get(0)[k]);
						monthTotal += monthExpenseList.get(0)[k];
					}
				} else { // ROW가 없는 경우, 0
					monthTotal = 0.0;
				}
				
				//LOG.debug("# monthKeyArray["+j+"] : " + monthTotal);
				
				// 그달의 키를 기준으로 올림처리해서 Map으로 저장
				monthMap.put(monthKeyArray[j], Math.round(monthTotal));
			}
			//LOG.debug("MEMBER_NO : " + membetList.get(i));
			// Map에 사번을 추가한다.
			monthMap.put("MEMBER_NO", membetList.get(i));
			
			// Map을 List에 저장한다.
			transList.add(monthMap);
		}
		
		if("1".equals(isAdmin)) {
			Map<String, Object> totalMonthMap = new HashMap<String, Object>();
			
			totalMonthMap.put("MEMBER_NO", "ALL");
			
			// 월별 합계 및 전체 합계 계산 기능 2020-04-08
			
			for(int i = 0; i < monthKeyArray.length; i++) {
				Integer totalValue = 0;
				
				for(int j = 0; j < transList.size(); j++) {
					
					totalValue += ((Long)transList.get(j).get(monthKeyArray[i])).intValue();
					
					//LOG.debug("# totalValue : ["+monthKeyArray[i]+"]" + transList.get(j).get("MEMBER_NO"));
					//LOG.debug("# totalValue : ["+monthKeyArray[i]+"]" + totalValue);
					
				}
				
				totalMonthMap.put(monthKeyArray[i], totalValue.longValue());
			}
			
			transList.add(totalMonthMap);
		}
		
		LOG.debug("교통비 일괄 처리 프로세스 - transList : " + transList);
		
		LOG.debug("## 교통비 일괄 처리 프로세스 END #########################################################");

		return transList;
			
	}
}
