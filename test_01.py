from typing import TypedDict, List, Dict

class AgentState(TypedDict):
    messages: List[Dict]
    
agent_system_prompt = """
Your are a assistant helful.

You must follow instruction and rules.

# TOOLS
- get_time_now

# RULES
- Always use TOOLS to response to user requests.
- Choose the TOOLS that best for user requests.
- If use TOOLS, you are required to return only string have example:

# Example
Tool: get_time_now
Args: 

"""

