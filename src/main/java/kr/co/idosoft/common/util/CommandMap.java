package kr.co.idosoft.common.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

public class CommandMap {

	Map<String,Object> map = new HashMap<String,Object>();

	public void put(String key, Object value) {
		map.put(key, value);
	}

	public Object get(String key) {
		return map.get(key);
	}

	public boolean isEmpty() {
		return map.isEmpty();
	}

	public Map<String, Object> getMap(){
		return map;
	}

	public void clear() {
		map.clear();
	}

	public boolean containsKey(String key) {
		return map.containsKey(key);
	}

	public boolean containsValue(Object value) {
		return map.containsValue(value);
	}

	public Object remove(String key) {
		return map.remove(key);
	}

	public Set<Entry<String, Object>> entrySet(){
		return map.entrySet();
	}

	public Set<String> keySet(){
		return map.keySet();
	}

	public void putAll(Map<? extends String, ? extends Object> m) {
		map.putAll(m);
	}
}
