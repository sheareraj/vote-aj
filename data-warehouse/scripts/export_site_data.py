from __future__ import annotations

from pathlib import Path
import subprocess

SITE = Path(__file__).resolve().parents[2]
SCRIPT = SITE / "data-warehouse" / "scripts" / "export_site_data.mjs"

if __name__ == "__main__":
    subprocess.run(["node", str(SCRIPT)], cwd=SITE, check=True)
