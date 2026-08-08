import glob

def check_syntax(path):
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()
    
    stack = []
    in_str = None
    esc = False
    
    for line_num, line in enumerate(code.splitlines(), 1):
        for col, c in enumerate(line, 1):
            if esc:
                esc = False
                continue
            if c == '\\':
                esc = True
                continue
            if in_str:
                if c == in_str:
                    in_str = None
            else:
                if c in ('"', "'", '`'):
                    in_str = c
                elif c in '({[':
                    stack.append((c, line_num, col))
                elif c in ')}]':
                    if not stack:
                        print(f"SYNTAX ERROR in {path}:{line_num}:{col} - Unexpected {c}")
                        return False
                    top, l, col_l = stack.pop()
                    expected = {'(': ')', '{': '}', '[': ']'}[top]
                    if c != expected:
                        print(f"SYNTAX ERROR in {path}:{line_num}:{col} - Expected {expected} for {top} at line {l}, got {c}")
                        return False
    if in_str:
        print(f"SYNTAX ERROR in {path} - Unclosed string literal {in_str}")
        return False
    if stack:
        top, l, col_l = stack[-1]
        print(f"SYNTAX ERROR in {path} - Unclosed {top} from line {l}")
        return False
    print(f"SUCCESS: {path} is 100% syntactically valid!")
    return True

all_valid = True
for p in sorted(glob.glob('js/**/*.js', recursive=True)):
    if not check_syntax(p):
        all_valid = False

if all_valid:
    print("\n🎉 ALL JavaScript files passed full AST bracket & string syntax validation!")
