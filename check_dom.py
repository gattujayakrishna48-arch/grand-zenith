import re, os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('js/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Extract tabs from sidebar nav in index.html
sidebar_tabs = re.findall(r'data-tab=["\']([^"\']+)["\']', html)
print('Sidebar data-tabs found in index.html:', sidebar_tabs)

# Extract tab-pane IDs in index.html
tab_panes = re.findall(r'id=["\']tab-([^"\']+)["\']', html)
print('Tab-panes found in index.html:', tab_panes)

# Check matching between nav tabs and tab panes
missing_panes = set(sidebar_tabs) - set(tab_panes)
if missing_panes:
    print('❌ ERROR: Sidebar tabs missing matching tab-pane:', missing_panes)
else:
    print('✅ All sidebar tabs have matching tab-panes in index.html!')

# Extract JS scripts in index.html
scripts = re.findall(r'src=["\']([^"\']+)["\']', html)
print('\nScripts loaded in index.html:', scripts)

# Check script file existence
print('\nChecking script file existence:')
for s in scripts:
    if os.path.exists(s):
        print(f'  ✅ {s} exists')
    else:
        print(f'  ❌ ERROR: {s} DOES NOT EXIST!')
