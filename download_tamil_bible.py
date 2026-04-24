#!/usr/bin/env python3
"""
ENJC Tamil Bible Full Download Script
Run this on your computer (not in Claude sandbox) to download full Tamil Bible
Usage: python3 download_tamil_bible.py
Output: tamil_full.json — place in church/data/ folder
"""
import urllib.request, json, time, os, sys

BOOKS = [
    (1,50),(2,40),(3,27),(4,36),(5,34),(6,24),(7,21),(8,4),
    (9,31),(10,24),(11,22),(12,25),(13,29),(14,36),(15,10),
    (16,13),(17,10),(18,42),(19,150),(20,31),(21,12),(22,8),
    (23,66),(24,52),(25,5),(26,48),(27,12),(28,14),(29,3),
    (30,9),(31,1),(32,4),(33,7),(34,3),(35,3),(36,3),(37,2),
    (38,14),(39,4),(40,28),(41,16),(42,24),(43,21),(44,28),
    (45,16),(46,16),(47,13),(48,6),(49,6),(50,4),(51,4),
    (52,5),(53,3),(54,6),(55,4),(56,3),(57,1),(58,13),(59,5),
    (60,5),(61,3),(62,5),(63,1),(64,1),(65,1),(66,22),
]

APIS = [
    'https://bolls.life/get-text/TAMOVR/{book}/{ch}/',
    'https://bolls.life/get-text/TAMBL98/{book}/{ch}/',
]

result = {}
total_ch = sum(c for _,c in BOOKS)
done = 0

print(f"Downloading {total_ch} chapters of Tamil Bible...")
print("This takes about 10-15 minutes. Do not close the terminal.\n")

for book_num, ch_count in BOOKS:
    for ch in range(1, ch_count + 1):
        key = f"{book_num}_{ch}"
        
        # Skip if already downloaded (resume support)
        if os.path.exists('tamil_partial.json'):
            with open('tamil_partial.json') as f:
                existing = json.load(f)
            if key in existing:
                result = existing
                done += 1
                continue
        
        for api in APIS:
            url = api.format(book=book_num, ch=ch)
            try:
                req = urllib.request.Request(url, headers={
                    'User-Agent': 'Mozilla/5.0',
                    'Accept': 'application/json'
                })
                r = urllib.request.urlopen(req, timeout=10)
                data = json.loads(r.read())
                
                if isinstance(data, list) and len(data) > 0:
                    verses = []
                    for v in data:
                        if isinstance(v, dict) and 'verse' in v and 'text' in v:
                            verses.append([v['verse'], v['text']])
                        elif isinstance(v, list) and len(v) >= 2:
                            verses.append([v[0], v[1]])
                    if verses:
                        result[key] = verses
                        break
            except Exception as e:
                continue
        
        done += 1
        if done % 50 == 0:
            # Save progress
            with open('tamil_partial.json', 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False)
            pct = (done/total_ch)*100
            print(f"  Progress: {done}/{total_ch} chapters ({pct:.1f}%) — saved")
        
        time.sleep(0.15)  # Be polite to API

# Final save
with open('tamil_full.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, separators=(',', ':'))

ch_count = len(result)
v_count = sum(len(v) for v in result.values())
size_kb = os.path.getsize('tamil_full.json') // 1024

print(f"\n✅ Done!")
print(f"   Chapters: {ch_count}/{total_ch}")
print(f"   Verses: {v_count:,}")
print(f"   File size: {size_kb}KB")
print(f"\nNext: Copy tamil_full.json to your church/data/ folder")
print(f"Then update bible.js loadTA() to check both files.")

if os.path.exists('tamil_partial.json'):
    os.remove('tamil_partial.json')
