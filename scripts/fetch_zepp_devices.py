import sys
import json

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"success": False, "error": "Username and password required"}))
        sys.exit(1)

    username = sys.argv[1]
    password = sys.argv[2]

    try:
        from huami_token.zepp import ZeppSession, ZeppClient

        session = ZeppSession(username, password)
        client = ZeppClient(session)
        devices = client.get_devices()

        device_list = []
        for d in devices:
            device_list.append({
                "mac": getattr(d, "mac", None) or getattr(d, "device_id", None) or "",
                "auth_key": getattr(d, "auth_key", "") or "",
                "device_source": getattr(d, "device_source", "") or "",
                "name": getattr(d, "name", "Amazfit Smartwatch"),
            })

        print(json.dumps({
            "success": True,
            "devices": device_list
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()
