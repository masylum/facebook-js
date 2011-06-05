NODE = node

test:
	@$(NODE) tests/facebook_client.js

.PHONY: test
