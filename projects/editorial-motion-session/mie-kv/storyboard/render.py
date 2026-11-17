import sys, os, importlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
mods = {'a': ('sb_a', {'1': 'panel1', '2': 'panel2', '3': 'panel3'}), 'b': ('sb_b', {'5': 'panel5', '6': 'panel6'}), 'c': ('sb_c', {'7': 'panel7', '8': 'panel8', '9': 'panel9'}), 'd': ('sb_d', {'10': 'panel10', '11': 'panel11', '12': 'panel12', '13': 'panel13'})}
want = set(sys.argv[1:]) or {str(i) for i in range(1, 14)}
os.makedirs('svg', exist_ok=True)
for key, (m, fns) in mods.items():
    try: mod = importlib.import_module(m)
    except ModuleNotFoundError: continue
    for n, fn in fns.items():
        if n in want:
            s = getattr(mod, fn)(); open(f'svg/p{n}.svg', 'w').write(s); print('p' + n, len(s) // 1024, 'KB')
            if '<!--FG-->' in s:
                head_defs = s[:s.index('<rect width=')]
                body = s[s.index('<!--BODY-->') + 11:s.index('<!--OVERLAY-->')]
                bg, fg = body.split('<!--FG-->', 1)
                base = '<rect width="1080" height="1920" fill="#EADCC3"/>'
                open(f'svg/p{n}_bg.svg', 'w').write(head_defs + base + bg + '</svg>')
                open(f'svg/p{n}_fg.svg', 'w').write(head_defs + fg + '</svg>')
