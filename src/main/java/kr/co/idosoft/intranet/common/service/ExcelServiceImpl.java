package kr.co.idosoft.intranet.common.service;

import java.util.List;
import java.util.Map;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.stereotype.Service;

/**
 * 
 * @author 유기환
 * @since 2020.03.16
 * @content ExcelService
 */

@Service
public class ExcelServiceImpl implements ExcelService {

	@Override
	public SXSSFWorkbook commonExcelWorkbook(String title, List<Map<String,Object>> list) {
		SXSSFWorkbook workbook = new SXSSFWorkbook();
			
		// 시트 생성
		SXSSFSheet sheet = workbook.createSheet(title);
		
		Map<String, Object> headItem = list.get(0);

		Row headerRow = sheet.createRow(0);
		
		for(Map.Entry<String, Object> subItem: headItem.entrySet()){
			// 셀 너비 설정
			sheet.setColumnWidth(0, 2000);
			
			// 해당 행의 첫번째 열 셀 생성
			Cell headerCell = headerRow.createCell(0);
			// 키값으로 header
			headerCell.setCellValue(String.valueOf(subItem.getKey()));
		}
		// 내용 행 및 셀 생성
		Row bodyRow = null;
		Cell bodyCell = null;
		
		for(Map<String, Object> bodyItem : list){
			int i = 0;
			
			// 행 생성
			bodyRow = sheet.createRow(i+1);
			for(Map.Entry<String, Object> subItem: bodyItem.entrySet()){
				int j = 0;
				bodyCell = bodyRow.createCell(j);
				
				// 데이터 번호 표시
				bodyCell.setCellValue(String.valueOf(subItem.getValue()));

				j++;
			}
			i++;
		}
		
		return workbook;
	}
}
