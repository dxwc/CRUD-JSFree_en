all:
	sudo psql -U crud_admin -d crud -c "DROP OWNED BY current_user cascade;"
	sudo psql -U crud_admin -d crud < ../node_modules/connect-pg-simple/table.sql
	sudo psql -U crud_admin -d crud < ./tables.sql