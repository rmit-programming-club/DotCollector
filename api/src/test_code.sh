#!/bin/sh
#
# An example hook script to verify what is about to be committed.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-commit".


PROJECT_ROOT=$(git rev-parse --show-toplevel)

echo "RUNNING TESTS"
cd $PROJECT_ROOT"/api/src" && python -m unittest test.alltests || exit
echo "TEST OK"

echo "CHECKING FOR CODE STYLE"
pycodestyle --exclude=$PROJECT_ROOT"/api/src/dotcollector/yaml","alltests.py" $PROJECT_ROOT"/api/src" || exit
echo "CODE STYLE OK"

echo "CHECKING STATIC CODING"
mypy --follow-imports skip $PROJECT_ROOT"/api/src/test" || exit
echo "STATIC CODING OK"
