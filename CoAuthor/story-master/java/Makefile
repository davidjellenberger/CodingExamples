# Makefile for Backend server and related utilities

SRC_DIR=src
BIN_DIR=bin

BUILD_CLASSPATH="$(CLASSPATH)::./$(SRC_DIR):lib/javax.json-api.jar:lib/jdbc.jar"
RUN_CLASSPATH="$(CLASSPATH)::./$(BIN_DIR):lib/javax.json.jar:lib/jdbc.jar"

SOURCE_NAMES=Backend.java Client.java Message.java Worker.java JsonWrangler.java TurnManager.java
SOURCES=$(SOURCE_NAMES:%.java=$(SRC_DIR)/%.java)
CLASSES=$(SOURCE_NAMES:%.java=$(BIN_DIR)/%.class)

.SUFFIXES: .class .java
.PHONY: runbackend runclient

.java.class:
	javac -cp $(BUILD_CLASSPATH) $*.java

default: $(CLASSES)

$(CLASSES): $(BIN_DIR)/%.class : $(SRC_DIR)/%.java
	javac -d $(BIN_DIR) -cp $(BUILD_CLASSPATH) $<

(BIN_DIR)/%.class: $(SRC_DIR)/%.java

javadoc:
	javadoc -author -private -d doc -classpath $(BUILD_CLASSPATH) $(SOURCES)

# call as "make port=<port> runbackend"
runbackend:
	java -cp $(RUN_CLASSPATH) Backend $(port) || echo "terminated"

# call as "make host=<hostname> port=<port> runclient"
runclient:
	java -cp $(RUN_CLASSPATH) Client $(host) $(port) || echo "terminated"
